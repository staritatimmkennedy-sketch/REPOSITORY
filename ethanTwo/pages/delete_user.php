<?php
// pages/delete_user.php
header('Content-Type: application/json');
session_start(); 
require_once __DIR__ . '/../db.php';

// Debug logging
error_log("DELETE_USER.PHP - Received request: " . print_r($_POST, true));

if (!isset($conn) || !($conn instanceof PDO)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection unavailable']);
    exit;
}

$userId = $_POST['user_id'] ?? null;

// Debug
error_log("DELETE_USER.PHP - User ID received: " . $userId);

if (!$userId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'User ID is required']);
    exit;
}

try {
    // === FETCH USER DATA BEFORE DELETE (for audit log) ===
    $stmt = $conn->prepare("
        SELECT username, firstName, lastName 
        FROM user 
        WHERE user_id = ?
    ");
    $stmt->execute([$userId]);
    $userData = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$userData) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'User not found.']);
        exit;
    }

    // === DELETE USER ===
    $stmt = $conn->prepare("DELETE FROM user WHERE user_id = ?");
    $stmt->execute([$userId]);

    if ($stmt->rowCount() > 0) {
        // === AUDIT LOG (DELETE) ===
        $currentUserId = $_SESSION['user_id'] ?? 'unknown';
        $deletedUsername = $userData['username'];
        $deletedName = trim($userData['firstName'] . ' ' . $userData['lastName']);

        $description = "Deleted user ID $userId: $deletedName (@$deletedUsername)";

        $logStmt = $conn->prepare("
            INSERT INTO audit_log (user_id, action_type, description) 
            VALUES (?, 'delete', ?)
        ");
        $logStmt->execute([$currentUserId, $description]);

        echo json_encode(['success' => true, 'message' => 'User deleted successfully!']);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'User not found or already deleted.']);
    }

} catch (PDOException $e) {
    error_log("Delete user error: " . $e->getMessage());
    http_response_code(500);

    // Optional: Detect foreign key constraint
    $message = 'Failed to delete user. It may be referenced in other records.';
    if (str_contains($e->getMessage(), 'foreign key')) {
        $message = 'Cannot delete user: It is being used in other records (e.g., materials, logs).';
    }

    echo json_encode(['success' => false, 'message' => $message]);
}
?>