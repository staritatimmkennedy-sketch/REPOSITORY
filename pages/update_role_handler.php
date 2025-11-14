<?php
// pages/update_role_handler.php
header('Content-Type: application/json');
session_start();  // REQUIRED FOR $_SESSION['user_id']
require_once __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    $roleId      = trim($_POST['role_id'] ?? '');
    $roleName    = trim($_POST['role_name'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $permissions = $_POST['permissions'] ?? [];

    if (empty($roleId) || !is_numeric($roleId)) {
        throw new Exception('Invalid Role ID');
    }
    if (empty($roleName)) {
        throw new Exception('Role name is required');
    }

    if (!isset($conn) || !($conn instanceof PDO)) {
        throw new Exception('Database connection unavailable');
    }

    // === FETCH OLD ROLE DATA FOR AUDIT ===
    $oldStmt = $conn->prepare("
        SELECT roleName, description 
        FROM role 
        WHERE role_id = ?
    ");
    $oldStmt->execute([$roleId]);
    $oldData = $oldStmt->fetch(PDO::FETCH_ASSOC);

    if (!$oldData) {
        throw new Exception('Role not found');
    }

    // === FETCH OLD PERMISSIONS ===
    $oldPermsStmt = $conn->prepare("
        SELECT permission FROM role_permissions WHERE role_id = ?
    ");
    $oldPermsStmt->execute([$roleId]);
    $oldPerms = array_column($oldPermsStmt->fetchAll(PDO::FETCH_ASSOC), 'permission');

    // === VALIDATE PERMISSIONS ===
    $allowedPerms = [
        'borrow_material', 'return_material', 'publish_material',
        'approve_publish', 'submit_material', 'approve_submission',
        'manage_users', 'manage_roles', 'manage_courses', 'manage_materials'
    ];
    $permissions = array_intersect($permissions, $allowedPerms);

    // === START TRANSACTION ===
    $conn->beginTransaction();

    // 1. Update role details
    $updateRoleStmt = $conn->prepare("
        UPDATE role SET roleName = ?, description = ? 
        WHERE role_id = ?
    ");
    $updateRoleStmt->execute([$roleName, $description ?: null, $roleId]);

    // 2. Delete old permissions
    $deletePermStmt = $conn->prepare("DELETE FROM role_permissions WHERE role_id = ?");
    $deletePermStmt->execute([$roleId]);

    // 3. Insert new permissions
    if (!empty($permissions)) {
        $permStmt = $conn->prepare("
            INSERT INTO role_permissions (role_id, permission) 
            VALUES (?, ?)
        ");
        foreach ($permissions as $perm) {
            $permStmt->execute([$roleId, $perm]);
        }
    }

    // === BUILD AUDIT LOG DESCRIPTION ===
    $changes = [];

    if ($roleName !== $oldData['roleName']) {
        $changes[] = "Name: '{$oldData['roleName']}' to '$roleName'";
    }
    if ($description !== ($oldData['description'] ?? '')) {
        $changes[] = "Description updated";
    }

    $addedPerms   = array_diff($permissions, $oldPerms);
    $removedPerms = array_diff($oldPerms, $permissions);

    if (!empty($addedPerms))   $changes[] = "Added permissions: " . implode(', ', $addedPerms);
    if (!empty($removedPerms)) $changes[] = "Removed permissions: " . implode(', ', $removedPerms);

    // === AUDIT LOG (UPDATE ROLE) ===
    if (!empty($changes)) {
        $currentUserId = $_SESSION['user_id'] ?? 'unknown';
        $descriptionText = "Updated role ID $roleId: " . implode('; ', $changes);

        $logStmt = $conn->prepare("
            INSERT INTO audit_log (user_id, action_type, description) 
            VALUES (?, 'update', ?)
        ");
        $logStmt->execute([$currentUserId, $descriptionText]);
    }

    $conn->commit();

    // === RETURN UPDATED ROLE ===
    $updatedRoleStmt = $conn->prepare("
        SELECT role_id, roleName AS role_name, COALESCE(description, '') AS description
        FROM role WHERE role_id = ?
    ");
    $updatedRoleStmt->execute([$roleId]);
    $updatedRole = $updatedRoleStmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'message' => 'Role updated successfully!',
        'role' => $updatedRole
    ]);

} catch (Exception $e) {
    if ($conn && $conn->inTransaction()) {
        $conn->rollBack();
    }
    error_log("Update role error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Update failed: ' . $e->getMessage()
    ]);
}
?>