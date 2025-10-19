<?php
// pages/delete_role_handler.php

header('Content-Type: application/json');
require_once __DIR__ . '/../db.php'; // Adjust path if necessary

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    $roleId = trim($_POST['role_id'] ?? '');

    if (empty($roleId) || !is_numeric($roleId)) {
        throw new Exception('Invalid Role ID');
    }

    if (!isset($conn) || !($conn instanceof PDO)) {
        throw new Exception('Database connection unavailable');
    }

    $conn->beginTransaction();

    // Check if the role is used by any user before attempting to delete
    // This is crucial because your DB schema (user_ibfk_2) does not have ON DELETE CASCADE/SET NULL
    $checkUserStmt = $conn->prepare("SELECT COUNT(*) FROM user WHERE role_id = ?");
    $checkUserStmt->execute([$roleId]);
    $userCount = $checkUserStmt->fetchColumn();

    if ($userCount > 0) {
        $conn->rollBack();
        throw new Exception("Cannot delete role. $userCount user(s) are currently assigned. Please reassign them first.");
    }
    
    // Delete the role. role_permissions will cascade delete due to role_permissions_ibfk_1
    $deleteRoleStmt = $conn->prepare("DELETE FROM role WHERE role_id = ?");
    $deleteRoleStmt->execute([$roleId]);

    if ($deleteRoleStmt->rowCount() === 0) {
        $conn->rollBack();
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Role not found or already deleted.']);
        exit;
    }

    $conn->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Role deleted successfully!',
        'role_id' => $roleId // Send back the ID to remove the row
    ]);

} catch (Exception $e) {
    if ($conn && $conn->inTransaction()) {
        $conn->rollBack();
    }
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Deletion failed: ' . $e->getMessage()]);
}
?>