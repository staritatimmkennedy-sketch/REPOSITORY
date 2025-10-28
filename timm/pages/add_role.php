<?php
// pages/add_role.php

header('Content-Type: application/json');
require_once __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    $roleName = trim($_POST['role_name'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $permissions = $_POST['permissions'] ?? [];

    if (empty($roleName)) {
        throw new Exception('Role name is required');
    }

    if (!isset($conn) || !($conn instanceof PDO)) {
        throw new Exception('Database connection unavailable');
    }

    // Validate permissions against allowed list
    $allowedPerms = [
        'borrow_material', 'return_material', 'publish_material',
        'approve_publish', 'submit_material', 'approve_submission',
        'manage_users', 'manage_roles', 'manage_courses', 'manage_materials'
    ];
    $permissions = array_intersect($permissions, $allowedPerms);

    $conn->beginTransaction();

    // Insert role (role_id auto-generated)
    $stmt = $conn->prepare("INSERT INTO role (roleName, description) VALUES (?, ?)");
    $stmt->execute([$roleName, $description ?: null]);
    $roleId = $conn->lastInsertId();

    // Insert permissions
    if (!empty($permissions)) {
        $permStmt = $conn->prepare("INSERT INTO role_permissions (role_id, permission) VALUES (?, ?)");
        foreach ($permissions as $perm) {
            $permStmt->execute([$roleId, $perm]);
        }
    }

    $conn->commit();

    echo json_encode([
        'success' => true,
        'role' => [
            'role_name' => $roleName,
            'description' => $description ?: ''
        ]
    ]);

} catch (Exception $e) {
    if (isset($pdo)) {
        $conn->rollback();
    }
    error_log("Add role error: " . $e->getMessage());
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>