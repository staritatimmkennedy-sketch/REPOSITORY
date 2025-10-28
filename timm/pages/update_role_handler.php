<?php
// pages/update_role_handler.php

header('Content-Type: application/json');
require_once __DIR__ . '/../db.php'; // Adjust path if necessary

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    $roleId = trim($_POST['role_id'] ?? '');
    $roleName = trim($_POST['role_name'] ?? '');
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

    // Validate permissions against allowed list (reusing logic from add_role.php)
    $allowedPerms = [
        'borrow_material', 'return_material', 'publish_material',
        'approve_publish', 'submit_material', 'approve_submission',
        'manage_users', 'manage_roles', 'manage_courses', 'manage_materials'
    ];
    $permissions = array_intersect($permissions, $allowedPerms);

    $conn->beginTransaction();

    // 1. Update role details
    $updateRoleStmt = $conn->prepare("UPDATE role SET roleName = ?, description = ? WHERE role_id = ?");
    $updateRoleStmt->execute([$roleName, $description ?: null, $roleId]);

    // 2. Delete existing permissions
    $deletePermStmt = $conn->prepare("DELETE FROM role_permissions WHERE role_id = ?");
    $deletePermStmt->execute([$roleId]);

    // 3. Insert new permissions
    if (!empty($permissions)) {
        $permStmt = $conn->prepare("INSERT INTO role_permissions (role_id, permission) VALUES (?, ?)");
        foreach ($permissions as $perm) {
            $permStmt->execute([$roleId, $perm]);
        }
    }

    $conn->commit();

    // Fetch updated role data for client-side table refresh
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
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Update failed: ' . $e->getMessage()]);
}
?>