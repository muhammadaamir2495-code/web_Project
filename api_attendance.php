<?php

// =========================================
// ATTENDANCE API - api_attendance.php
// ATTENDANCE MANAGEMENT OPERATIONS
// =========================================

header('Content-Type: application/json');
require_once 'db_config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

// =========================================
// GET STUDENT ATTENDANCE
// =========================================

if ($method === 'GET' && $action === 'get-attendance') {

    if (!isset($_GET['studentId']) || !isset($_GET['courseId'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Student ID and Course ID required']);
        exit;
    }

    $studentId = intval($_GET['studentId']);
    $courseId = intval($_GET['courseId']);

    $stmt = $conn->prepare("SELECT * FROM attendance 
                           WHERE student_id = ? AND course_id = ?
                           ORDER BY session_date DESC");
    $stmt->bind_param("ii", $studentId, $courseId);
    $stmt->execute();
    $result = $stmt->get_result();
    $attendance = $result->fetch_all(MYSQLI_ASSOC);

    // Calculate statistics
    $totalClasses = count($attendance);
    $presentCount = 0;
    foreach ($attendance as $record) {
        if ($record['status'] === 'present' || $record['status'] === 'late') {
            $presentCount++;
        }
    }
    $percentage = $totalClasses > 0 ? ($presentCount / $totalClasses) * 100 : 0;

    echo json_encode([
        'success' => true,
        'attendance' => $attendance,
        'statistics' => [
            'totalClasses' => $totalClasses,
            'presentCount' => $presentCount,
            'absentCount' => $totalClasses - $presentCount,
            'percentage' => round($percentage, 2)
        ]
    ]);

    exit;
}

// =========================================
// MARK ATTENDANCE
// =========================================

if ($method === 'POST' && $action === 'mark-attendance') {

    $data = json_decode(file_get_contents("php://input"), true);

    $required = ['studentId', 'courseId', 'sessionDate', 'status'];
    foreach ($required as $field) {
        if (!isset($data[$field])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => "Missing field: $field"]);
            exit;
        }
    }

    $studentId = intval($data['studentId']);
    $courseId = intval($data['courseId']);
    $sessionDate = $data['sessionDate'];
    $status = $data['status'];
    $remarks = trim($data['remarks'] ?? '');
    $markedBy = intval($data['markedBy'] ?? 0);

    // Check if already marked
    $checkStmt = $conn->prepare("SELECT id FROM attendance WHERE student_id = ? AND course_id = ? AND session_date = ?");
    $checkStmt->bind_param("iis", $studentId, $courseId, $sessionDate);
    $checkStmt->execute();

    if ($checkStmt->get_result()->num_rows > 0) {
        // Update
        $updateStmt = $conn->prepare("UPDATE attendance SET status = ?, remarks = ? WHERE student_id = ? AND course_id = ? AND session_date = ?");
        $updateStmt->bind_param("siiis", $status, $remarks, $studentId, $courseId, $sessionDate);

        if ($updateStmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Attendance updated successfully'
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Update failed']);
        }
    } else {
        // Insert
        $insertStmt = $conn->prepare("INSERT INTO attendance (course_id, student_id, session_date, status, remarks, markedBy) 
                                     VALUES (?, ?, ?, ?, ?, ?)");
        $insertStmt->bind_param("iisssi", $courseId, $studentId, $sessionDate, $status, $remarks, $markedBy);

        if ($insertStmt->execute()) {
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Attendance marked successfully',
                'attendanceId' => $insertStmt->insert_id
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to mark attendance']);
        }
    }

    exit;
}

// =========================================
// GET COURSE ATTENDANCE REPORT
// =========================================

if ($method === 'GET' && $action === 'get-course-report') {

    if (!isset($_GET['courseId'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Course ID required']);
        exit;
    }

    $courseId = intval($_GET['courseId']);

    $stmt = $conn->prepare("SELECT u.id, u.fullName, u.email,
                           COUNT(a.id) as totalClasses,
                           SUM(CASE WHEN a.status IN ('present', 'late') THEN 1 ELSE 0 END) as presentCount,
                           SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absentCount,
                           ROUND(SUM(CASE WHEN a.status IN ('present', 'late') THEN 1 ELSE 0 END) / COUNT(a.id) * 100, 2) as percentage
                           FROM users u
                           LEFT JOIN attendance a ON u.id = a.student_id AND a.course_id = ?
                           WHERE u.role = 'student'
                           GROUP BY u.id");
    $stmt->bind_param("i", $courseId);
    $stmt->execute();
    $result = $stmt->get_result();
    $report = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode([
        'success' => true,
        'report' => $report,
        'count' => count($report)
    ]);

    exit;
}

// =========================================
// GET ATTENDANCE BY DATE
// =========================================

if ($method === 'GET' && $action === 'get-by-date') {

    if (!isset($_GET['courseId']) || !isset($_GET['sessionDate'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Course ID and session date required']);
        exit;
    }

    $courseId = intval($_GET['courseId']);
    $sessionDate = $_GET['sessionDate'];

    $stmt = $conn->prepare("SELECT a.*, u.fullName, u.email FROM attendance a
                           JOIN users u ON a.student_id = u.id
                           WHERE a.course_id = ? AND a.session_date = ?
                           ORDER BY u.fullName ASC");
    $stmt->bind_param("is", $courseId, $sessionDate);
    $stmt->execute();
    $result = $stmt->get_result();
    $attendance = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode([
        'success' => true,
        'attendance' => $attendance,
        'count' => count($attendance)
    ]);

    exit;
}

// =========================================
// BULK MARK ATTENDANCE
// =========================================

if ($method === 'POST' && $action === 'bulk-mark') {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['courseId']) || !isset($data['sessionDate']) || !isset($data['records'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }

    $courseId = intval($data['courseId']);
    $sessionDate = $data['sessionDate'];
    $records = $data['records'];
    $successCount = 0;

    foreach ($records as $record) {
        $studentId = intval($record['studentId']);
        $status = $record['status'];

        $stmt = $conn->prepare("INSERT INTO attendance (course_id, student_id, session_date, status) 
                               VALUES (?, ?, ?, ?)
                               ON DUPLICATE KEY UPDATE status = VALUES(status)");
        $stmt->bind_param("iiss", $courseId, $studentId, $sessionDate, $status);

        if ($stmt->execute()) {
            $successCount++;
        }
    }

    echo json_encode([
        'success' => true,
        'message' => "Attendance marked for $successCount students",
        'count' => $successCount
    ]);

    exit;
}

// =========================================
// DEFAULT RESPONSE
// =========================================

http_response_code(404);
echo json_encode(['success' => false, 'message' => 'Endpoint not found']);

?>
