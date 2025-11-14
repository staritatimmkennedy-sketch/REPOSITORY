<?php
// pages/delete_role_handler.php
header('Content-Type: application/json');
session_start();  // REQUIRED FOR $_SESSION['user_id']
require_once __DIR__ . '/../db.php';

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

    // === FETCH ROLE NAME BEFORE DELETE (for audit log) ===
    $roleStmt = $conn->prepare("
        SELECT roleName FROM role WHERE role_id = ?
    ");
    $roleStmt->execute([$roleId]);
    $roleData = $roleStmt->fetch(PDO::FETCH_ASSOC);

    if (!$roleData) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Role not found.']);
        exit;
    }

    $roleName = $roleData['roleName'];

    // === CHECK IF ROLE IS IN USE ===
    $checkUserStmt = $conn->prepare("SELECT COUNT(*) FROM user WHERE role_id = ?");
    $checkUserStmt->execute([$roleId]);
    $userCount = $checkUserStmt->fetchColumn();

    if ($userCount > 0) {
        $message = "Cannot delete role. $userCount user(s) are currently assigned. Please reassign them first.";
        echo json_encode(['success' => false, 'message' => $message]);
        exit;
    }

    // === START TRANSACTION ===
    $conn->beginTransaction();

    // === DELETE ROLE (permissions cascade via FK) ===
    $deleteRoleStmt = $conn->prepare("DELETE FROM role WHERE role_id = ?");
    $deleteRoleStmt->execute([$roleId]);

    if ($deleteRoleStmt->rowCount() === 0) {
        $conn->rollBack();
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Role not found or already deleted.']);
        exit;
    }

    // === AUDIT LOG: ROLE DELETED ===
    $currentUserId = $_SESSION['user_id'] ?? 'unknown';
    $description = "Deleted role ID $roleId: '$roleName' (no users assigned)";

    $logStmt = $conn->prepare("
        INSERT INTO audit_log (user_id, action_type, description) 
        VALUES (?, 'delete', ?)
    ");
    $logStmt->execute([$currentUserId, $description]);

    $conn->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Role deleted successfully!',
        'role_id' => $roleId
    ]);

} catch (Exception $e) {
    if ($conn && $conn->inTransaction()) {
        $conn->rollBack();
    }
    error_log("Delete role error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Deletion failed: ' . $e->getMessage()]);
}
?>