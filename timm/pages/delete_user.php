<?php
// pages/delete_user.php

header('Content-Type: application/json');
require_once __DIR__ . '/../db.php';

if (!isset($conn) || !($conn instanceof PDO)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection unavailable']);
    exit;
}

$userId = $_POST['user_id'] ?? null;

if (!$userId) {
    http_response_code(400); // This is the 400 Bad Request status
    echo json_encode(['success' => false, 'message' => 'User ID is required']);
    exit;
}

try {
    $stmt = $conn->prepare("DELETE FROM user WHERE user_id = ?");
    $stmt->execute([$userId]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'User deleted successfully!']);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'User not found or already deleted.']);
    }

} catch (PDOException $e) {
    error_log("Delete user error: " . $e->getMessage());
    http_response_code(500);

    // Check for foreign key constraints based on your DB schema
    $message = 'Failed to delete user. Please check for foreign key constraints.';
    // ... additional error handling logic
    
    echo json_encode(['success' => false, 'message' => $message]);
}
?>