<?php

// =========================================
// ASSIGNMENTS API - api_assignments.php
// ASSIGNMENT MANAGEMENT OPERATIONS
// =========================================

header('Content-Type: application/json');
require_once 'db_config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

// =========================================
// GET ALL ASSIGNMENTS FOR A COURSE
// =========================================

if ($method === 'GET' && $action === 'get-course-assignments') {

    if (!isset($_GET['courseId'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Course ID required']);
        exit;
    }

    $courseId = intval($_GET['courseId']);

    $stmt = $conn->prepare("SELECT a.*, u.fullName as assignedByName FROM assignments a 
                           JOIN users u ON a.assignedBy = u.id 
                           WHERE a.course_id = ? 
                           ORDER BY a.dueDate ASC");
    $stmt->bind_param("i", $courseId);
    $stmt->execute();
    $result = $stmt->get_result();
    $assignments = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode([
        'success' => true,
        'assignments' => $assignments,
        'count' => count($assignments)
    ]);

    exit;
}

// =========================================
// GET SINGLE ASSIGNMENT
// =========================================

if ($method === 'GET' && $action === 'get-assignment') {

    if (!isset($_GET['assignmentId'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Assignment ID required']);
        exit;
    }

    $assignmentId = intval($_GET['assignmentId']);

    $stmt = $conn->prepare("SELECT a.*, u.fullName as assignedByName FROM assignments a 
                           JOIN users u ON a.assignedBy = u.id 
                           WHERE a.id = ?");
    $stmt->bind_param("i", $assignmentId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Assignment not found']);
        exit;
    }

    echo json_encode([
        'success' => true,
        'assignment' => $result->fetch_assoc()
    ]);

    exit;
}

// =========================================
// CREATE NEW ASSIGNMENT (TEACHER ONLY)
// =========================================

if ($method === 'POST' && $action === 'create-assignment') {

    $data = json_decode(file_get_contents("php://input"), true);

    $required = ['title', 'courseId', 'assignedBy', 'dueDate'];
    foreach ($required as $field) {
        if (!isset($data[$field])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => "Missing field: $field"]);
            exit;
        }
    }

    $title = trim($data['title']);
    $description = trim($data['description'] ?? '');
    $courseId = intval($data['courseId']);
    $assignedBy = intval($data['assignedBy']);
    $dueDate = $data['dueDate'];
    $maxScore = intval($data['maxScore'] ?? 100);

    $stmt = $conn->prepare("INSERT INTO assignments (title, description, course_id, assignedBy, dueDate, maxScore) 
                           VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssiisd", $title, $description, $courseId, $assignedBy, $dueDate, $maxScore);

    if ($stmt->execute()) {
        $assignmentId = $stmt->insert_id;
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Assignment created successfully',
            'assignmentId' => $assignmentId
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to create assignment']);
    }

    exit;
}

// =========================================
// UPDATE ASSIGNMENT
// =========================================

if ($method === 'PUT' && $action === 'update-assignment') {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['assignmentId'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Assignment ID required']);
        exit;
    }

    $assignmentId = intval($data['assignmentId']);
    $title = trim($data['title'] ?? '');
    $description = trim($data['description'] ?? '');
    $dueDate = $data['dueDate'] ?? '';
    $maxScore = intval($data['maxScore'] ?? 100);
    $status = $data['status'] ?? 'active';

    $stmt = $conn->prepare("UPDATE assignments SET title = ?, description = ?, dueDate = ?, maxScore = ?, status = ? WHERE id = ?");
    $stmt->bind_param("sssisi", $title, $description, $dueDate, $maxScore, $status, $assignmentId);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Assignment updated successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Update failed']);
    }

    exit;
}

// =========================================
// DELETE ASSIGNMENT
// =========================================

if ($method === 'DELETE' && $action === 'delete-assignment') {

    if (!isset($_GET['assignmentId'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Assignment ID required']);
        exit;
    }

    $assignmentId = intval($_GET['assignmentId']);

    $stmt = $conn->prepare("DELETE FROM assignments WHERE id = ?");
    $stmt->bind_param("i", $assignmentId);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Assignment deleted successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Deletion failed']);
    }

    exit;
}

// =========================================
// SUBMIT ASSIGNMENT
// =========================================

if ($method === 'POST' && $action === 'submit-assignment') {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['assignmentId']) || !isset($data['studentId'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Assignment ID and Student ID required']);
        exit;
    }

    $assignmentId = intval($data['assignmentId']);
    $studentId = intval($data['studentId']);
    $submissionText = trim($data['submissionText'] ?? '');

    // Check if already submitted
    $checkStmt = $conn->prepare("SELECT id FROM assignment_submissions WHERE assignment_id = ? AND student_id = ?");
    $checkStmt->bind_param("ii", $assignmentId, $studentId);
    $checkStmt->execute();

    if ($checkStmt->get_result()->num_rows > 0) {
        http_response_code(409);
        echo json_encode(['success' => false, 'message' => 'Assignment already submitted']);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO assignment_submissions (assignment_id, student_id, submissionText, status) 
                           VALUES (?, ?, ?, 'submitted')");
    $stmt->bind_param("iis", $assignmentId, $studentId, $submissionText);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Assignment submitted successfully',
            'submissionId' => $stmt->insert_id
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Submission failed']);
    }

    exit;
}

// =========================================
// GET STUDENT SUBMISSIONS FOR ASSIGNMENT
// =========================================

if ($method === 'GET' && $action === 'get-submissions') {

    if (!isset($_GET['assignmentId'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Assignment ID required']);
        exit;
    }

    $assignmentId = intval($_GET['assignmentId']);

    $stmt = $conn->prepare("SELECT s.*, u.fullName, u.email FROM assignment_submissions s 
                           JOIN users u ON s.student_id = u.id 
                           WHERE s.assignment_id = ? 
                           ORDER BY s.submittedAt DESC");
    $stmt->bind_param("i", $assignmentId);
    $stmt->execute();
    $result = $stmt->get_result();
    $submissions = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode([
        'success' => true,
        'submissions' => $submissions,
        'count' => count($submissions)
    ]);

    exit;
}

// =========================================
// GRADE SUBMISSION
// =========================================

if ($method === 'PUT' && $action === 'grade-submission') {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['submissionId']) || !isset($data['score'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Submission ID and score required']);
        exit;
    }

    $submissionId = intval($data['submissionId']);
    $score = intval($data['score']);
    $feedback = trim($data['feedback'] ?? '');

    $stmt = $conn->prepare("UPDATE assignment_submissions SET score = ?, feedback = ?, status = 'graded', gradedAt = CURRENT_TIMESTAMP WHERE id = ?");
    $stmt->bind_param("isi", $score, $feedback, $submissionId);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Submission graded successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Grading failed']);
    }

    exit;
}

// =========================================
// DEFAULT RESPONSE
// =========================================

http_response_code(404);
echo json_encode(['success' => false, 'message' => 'Endpoint not found']);

?>
