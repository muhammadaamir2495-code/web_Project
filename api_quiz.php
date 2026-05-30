<?php

// =========================================
// QUIZ API - api_quiz.php
// QUIZ MANAGEMENT OPERATIONS
// =========================================

header('Content-Type: application/json');
require_once 'db_config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

// =========================================
// GET ALL QUIZZES FOR A COURSE
// =========================================

if ($method === 'GET' && $action === 'get-course-quizzes') {

    if (!isset($_GET['courseId'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Course ID required']);
        exit;
    }

    $courseId = intval($_GET['courseId']);

    $stmt = $conn->prepare("SELECT q.*, u.fullName as createdByName FROM quizzes q 
                           JOIN users u ON q.createdBy = u.id 
                           WHERE q.course_id = ? AND q.status = 'published'
                           ORDER BY q.startDate DESC");
    $stmt->bind_param("i", $courseId);
    $stmt->execute();
    $result = $stmt->get_result();
    $quizzes = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode([
        'success' => true,
        'quizzes' => $quizzes,
        'count' => count($quizzes)
    ]);

    exit;
}

// =========================================
// GET QUIZ WITH QUESTIONS
// =========================================

if ($method === 'GET' && $action === 'get-quiz') {

    if (!isset($_GET['quizId'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Quiz ID required']);
        exit;
    }

    $quizId = intval($_GET['quizId']);

    // Get quiz details
    $stmt = $conn->prepare("SELECT * FROM quizzes WHERE id = ?");
    $stmt->bind_param("i", $quizId);
    $stmt->execute();
    $quizResult = $stmt->get_result();

    if ($quizResult->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Quiz not found']);
        exit;
    }

    $quiz = $quizResult->fetch_assoc();

    // Get questions
    $questStmt = $conn->prepare("SELECT id, questionNumber, questionText, questionType, marks FROM quiz_questions WHERE quiz_id = ? ORDER BY questionNumber ASC");
    $questStmt->bind_param("i", $quizId);
    $questStmt->execute();
    $questions = $questStmt->get_result()->fetch_all(MYSQLI_ASSOC);

    // Get options for each question
    foreach ($questions as &$question) {
        $optStmt = $conn->prepare("SELECT id, optionText FROM quiz_options WHERE question_id = ?");
        $optStmt->bind_param("i", $question['id']);
        $optStmt->execute();
        $question['options'] = $optStmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    $quiz['questions'] = $questions;

    echo json_encode([
        'success' => true,
        'quiz' => $quiz
    ]);

    exit;
}

// =========================================
// START QUIZ ATTEMPT
// =========================================

if ($method === 'POST' && $action === 'start-attempt') {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['quizId']) || !isset($data['studentId'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Quiz ID and Student ID required']);
        exit;
    }

    $quizId = intval($data['quizId']);
    $studentId = intval($data['studentId']);

    // Get quiz info
    $quizStmt = $conn->prepare("SELECT totalMarks FROM quizzes WHERE id = ?");
    $quizStmt->bind_param("i", $quizId);
    $quizStmt->execute();
    $quizResult = $quizStmt->get_result()->fetch_assoc();

    if (!$quizResult) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Quiz not found']);
        exit;
    }

    // Check for existing in-progress attempt
    $checkStmt = $conn->prepare("SELECT id FROM quiz_attempts WHERE quiz_id = ? AND student_id = ? AND status = 'in-progress'");
    $checkStmt->bind_param("ii", $quizId, $studentId);
    $checkStmt->execute();

    if ($checkStmt->get_result()->num_rows > 0) {
        http_response_code(409);
        echo json_encode(['success' => false, 'message' => 'Quiz already in progress']);
        exit;
    }

    // Create new attempt
    $totalMarks = $quizResult['totalMarks'];
    $stmt = $conn->prepare("INSERT INTO quiz_attempts (quiz_id, student_id, totalMarks, status) VALUES (?, ?, ?, 'in-progress')");
    $stmt->bind_param("iii", $quizId, $studentId, $totalMarks);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Quiz attempt started',
            'attemptId' => $stmt->insert_id
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to start attempt']);
    }

    exit;
}

// =========================================
// SUBMIT ANSWER
// =========================================

if ($method === 'POST' && $action === 'submit-answer') {

    $data = json_decode(file_get_contents("php://input"), true);

    $required = ['attemptId', 'questionId'];
    foreach ($required as $field) {
        if (!isset($data[$field])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => "Missing field: $field"]);
            exit;
        }
    }

    $attemptId = intval($data['attemptId']);
    $questionId = intval($data['questionId']);
    $selectedOptionId = isset($data['selectedOptionId']) ? intval($data['selectedOptionId']) : null;
    $studentAnswer = isset($data['studentAnswer']) ? trim($data['studentAnswer']) : null;

    // Check if answer already submitted
    $checkStmt = $conn->prepare("SELECT id FROM quiz_answers WHERE attempt_id = ? AND question_id = ?");
    $checkStmt->bind_param("ii", $attemptId, $questionId);
    $checkStmt->execute();

    $isCorrect = 0;

    if ($checkStmt->get_result()->num_rows > 0) {
        // Update existing answer
        $updateStmt = $conn->prepare("UPDATE quiz_answers SET selectedOption_id = ?, studentAnswer = ? WHERE attempt_id = ? AND question_id = ?");
        $updateStmt->bind_param("iiii", $selectedOptionId, $studentAnswer, $attemptId, $questionId);
        $updateStmt->execute();
    } else {
        // Check if answer is correct
        if ($selectedOptionId !== null) {
            $correctStmt = $conn->prepare("SELECT isCorrect FROM quiz_options WHERE id = ?");
            $correctStmt->bind_param("i", $selectedOptionId);
            $correctStmt->execute();
            $correctResult = $correctStmt->get_result()->fetch_assoc();
            if ($correctResult && $correctResult['isCorrect']) {
                $isCorrect = 1;
            }
        }

        // Insert new answer
        $insertStmt = $conn->prepare("INSERT INTO quiz_answers (attempt_id, question_id, selectedOption_id, studentAnswer, isCorrect) 
                                     VALUES (?, ?, ?, ?, ?)");
        $insertStmt->bind_param("iiiis", $attemptId, $questionId, $selectedOptionId, $studentAnswer, $isCorrect);
        $insertStmt->execute();
    }

    echo json_encode([
        'success' => true,
        'message' => 'Answer submitted',
        'isCorrect' => $isCorrect
    ]);

    exit;
}

// =========================================
// END QUIZ ATTEMPT
// =========================================

if ($method === 'POST' && $action === 'end-attempt') {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['attemptId'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Attempt ID required']);
        exit;
    }

    $attemptId = intval($data['attemptId']);

    // Get total marks from correct answers
    $calcStmt = $conn->prepare("SELECT COALESCE(SUM(q.marks), 0) as marksObtained FROM quiz_answers qa
                               JOIN quiz_questions q ON qa.question_id = q.id
                               WHERE qa.attempt_id = ? AND qa.isCorrect = 1");
    $calcStmt->bind_param("i", $attemptId);
    $calcStmt->execute();
    $result = $calcStmt->get_result()->fetch_assoc();
    $marksObtained = intval($result['marksObtained']);

    // Get total marks and passing marks
    $attemptStmt = $conn->prepare("SELECT qa.quiz_id, q.totalMarks, q.passingMarks FROM quiz_attempts qa
                                  JOIN quizzes q ON qa.quiz_id = q.id
                                  WHERE qa.id = ?");
    $attemptStmt->bind_param("i", $attemptId);
    $attemptStmt->execute();
    $attemptResult = $attemptStmt->get_result()->fetch_assoc();

    $totalMarks = intval($attemptResult['totalMarks']);
    $passingMarks = intval($attemptResult['passingMarks']);
    $percentage = ($marksObtained / $totalMarks) * 100;
    $status = $percentage >= ($passingMarks / $totalMarks * 100) ? 'passed' : 'failed';

    // Calculate time taken
    $timeStmt = $conn->prepare("SELECT TIMESTAMPDIFF(SECOND, startTime, CURRENT_TIMESTAMP) as timeTaken FROM quiz_attempts WHERE id = ?");
    $timeStmt->bind_param("i", $attemptId);
    $timeStmt->execute();
    $timeResult = $timeStmt->get_result()->fetch_assoc();
    $timeTaken = intval($timeResult['timeTaken']);

    // Update attempt
    $updateStmt = $conn->prepare("UPDATE quiz_attempts SET marksObtained = ?, percentage = ?, status = ?, endTime = CURRENT_TIMESTAMP, timeTaken = ? WHERE id = ?");
    $updateStmt->bind_param("idsii", $marksObtained, $percentage, $status, $timeTaken, $attemptId);

    if ($updateStmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Quiz attempt completed',
            'marksObtained' => $marksObtained,
            'totalMarks' => $totalMarks,
            'percentage' => round($percentage, 2),
            'status' => $status,
            'timeTaken' => $timeTaken
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to end attempt']);
    }

    exit;
}

// =========================================
// GET STUDENT QUIZ HISTORY
// =========================================

if ($method === 'GET' && $action === 'get-history') {

    if (!isset($_GET['studentId'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Student ID required']);
        exit;
    }

    $studentId = intval($_GET['studentId']);

    $stmt = $conn->prepare("SELECT qa.id, q.title, qa.marksObtained, qa.totalMarks, qa.percentage, qa.status, qa.endTime, qa.timeTaken 
                           FROM quiz_attempts qa
                           JOIN quizzes q ON qa.quiz_id = q.id
                           WHERE qa.student_id = ? AND qa.status != 'in-progress'
                           ORDER BY qa.endTime DESC");
    $stmt->bind_param("i", $studentId);
    $stmt->execute();
    $result = $stmt->get_result();
    $history = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode([
        'success' => true,
        'history' => $history,
        'count' => count($history)
    ]);

    exit;
}

// =========================================
// DEFAULT RESPONSE
// =========================================

http_response_code(404);
echo json_encode(['success' => false, 'message' => 'Endpoint not found']);

?>
