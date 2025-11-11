<?php
// pages/get_user.php

header('Content-Type: application/json');
require_once __DIR__ . '/../db.php';

if (!isset($conn) || !($conn instanceof PDO)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection unavailable']);
    exit;
}

$userId = $_GET['user_id'] ?? null;

if (!$userId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'User ID is required']);
    exit;
}

try {
    // Fetch all user details excluding password, and JOIN to get the correct course_id
    $stmt = $conn->prepare("
        SELECT
            u.user_id, u.firstName, u.middleName, u.lastName, u.yearLevel, u.username, u.role_id,
            uc.course_id
        FROM user u
        LEFT JOIN user_course uc ON u.userCourse_id = uc.userCourse_id
        WHERE u.user_id = ?
    ");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // The $user array now contains 'course_id' instead of 'userCourse_id'
        echo json_encode(['success' => true, 'user' => $user]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'User not found']);
    }

} catch (PDOException $e) {
    error_log("Get user error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>