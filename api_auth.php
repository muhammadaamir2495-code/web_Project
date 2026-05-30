<?php

// =========================================
// AUTH API - api_auth.php
// REGISTRATION AND LOGIN OPERATIONS
// =========================================

header('Content-Type: application/json');
require_once 'db_config.php';

// Get request method and action
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

// =========================================
// REGISTRATION ENDPOINT
// =========================================

if ($method === 'POST' && $action === 'register') {

    // Get JSON data
    $data = json_decode(file_get_contents("php://input"), true);

    // Validate input
    if (!isset($data['fullName']) || !isset($data['email']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }

    $fullName = trim($data['fullName']);
    $username = trim($data['username'] ?? '');
    $email = trim($data['email']);
    $phone = trim($data['phone'] ?? '');
    $password = $data['password'];

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid email format']);
        exit;
    }

    // Validate password length
    if (strlen($password) < 6) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters']);
        exit;
    }

    // Check if email already exists
    $checkEmail = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $checkEmail->bind_param("s", $email);
    $checkEmail->execute();

    if ($checkEmail->get_result()->num_rows > 0) {
        http_response_code(409);
        echo json_encode(['success' => false, 'message' => 'Email already registered']);
        exit;
    }

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Insert user
    $stmt = $conn->prepare("INSERT INTO users (fullName, username, email, phone, password, role) VALUES (?, ?, ?, ?, ?, 'student')");
    $stmt->bind_param("sssss", $fullName, $username, $email, $phone, $hashedPassword);

    if ($stmt->execute()) {
        $userId = $stmt->insert_id;
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Registration successful',
            'userId' => $userId
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Registration failed']);
    }

    exit;
}

// =========================================
// LOGIN ENDPOINT
// =========================================

if ($method === 'POST' && $action === 'login') {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['email']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Email and password required']);
        exit;
    }

    $email = trim($data['email']);
    $password = $data['password'];

    // Get user
    $stmt = $conn->prepare("SELECT id, fullName, username, email, phone, role, password, status FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
        exit;
    }

    $user = $result->fetch_assoc();

    // Check password
    if (!password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
        exit;
    }

    // Check if user is active
    if ($user['status'] !== 'active') {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Account is inactive']);
        exit;
    }

    // Update last login
    $updateLogin = $conn->prepare("UPDATE users SET lastLogin = CURRENT_TIMESTAMP WHERE id = ?");
    $updateLogin->bind_param("i", $user['id']);
    $updateLogin->execute();

    // Return user data (without password)
    unset($user['password']);
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'user' => $user
    ]);

    exit;
}

// =========================================
// GET USER PROFILE
// =========================================

if ($method === 'GET' && $action === 'profile') {

    if (!isset($_GET['userId'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'User ID required']);
        exit;
    }

    $userId = intval($_GET['userId']);

    $stmt = $conn->prepare("SELECT id, fullName, username, email, phone, role, status, registeredAt, lastLogin FROM users WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit;
    }

    echo json_encode([
        'success' => true,
        'user' => $result->fetch_assoc()
    ]);

    exit;
}

// =========================================
// UPDATE USER PROFILE
// =========================================

if ($method === 'PUT' && $action === 'update-profile') {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['userId'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'User ID required']);
        exit;
    }

    $userId = intval($data['userId']);
    $fullName = trim($data['fullName'] ?? '');
    $phone = trim($data['phone'] ?? '');

    $stmt = $conn->prepare("UPDATE users SET fullName = ?, phone = ? WHERE id = ?");
    $stmt->bind_param("ssi", $fullName, $phone, $userId);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Profile updated successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Update failed']);
    }

    exit;
}

// =========================================
// CHANGE PASSWORD
// =========================================

if ($method === 'POST' && $action === 'change-password') {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['userId']) || !isset($data['oldPassword']) || !isset($data['newPassword'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }

    $userId = intval($data['userId']);
    $oldPassword = $data['oldPassword'];
    $newPassword = $data['newPassword'];

    // Get user password
    $stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit;
    }

    $user = $result->fetch_assoc();

    // Verify old password
    if (!password_verify($oldPassword, $user['password'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Incorrect old password']);
        exit;
    }

    // Hash new password
    $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);

    // Update password
    $updateStmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
    $updateStmt->bind_param("si", $hashedPassword, $userId);

    if ($updateStmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Password changed successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Password change failed']);
    }

    exit;
}

// =========================================
// DEFAULT RESPONSE
// =========================================

http_response_code(404);
echo json_encode(['success' => false, 'message' => 'Endpoint not found']);

?>
