<?php
// pages/get_role_details.php

header('Content-Type: application/json');
require_once __DIR__ . '/../db.php'; // Adjust path if necessary

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$roleId = $_GET['role_id'] ?? null;

if (empty($roleId) || !is_numeric($roleId)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid Role ID']);
    exit;
}

try {
    // Database connection check
    if (!isset($conn) || !($conn instanceof PDO)) {
        throw new Exception('Database connection unavailable');
    }

    // 1. Fetch Role Details
    $roleStmt = $conn->prepare("
        SELECT role_id, roleName AS role_name, COALESCE(description, '') AS description 
        FROM role 
        WHERE role_id = ?
    ");
    $roleStmt->execute([$roleId]);
    $role = $roleStmt->fetch(PDO::FETCH_ASSOC);

    if (!$role) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Role not found']);
        exit;
    }

    // 2. Fetch Permissions
    $permStmt = $conn->prepare("
        SELECT permission 
        FROM role_permissions 
        WHERE role_id = ?
    ");
    $permStmt->execute([$roleId]);
    $permissions = $permStmt->fetchAll(PDO::FETCH_COLUMN, 0);

    $role['permissions'] = $permissions;

    echo json_encode(['success' => true, 'role' => $role]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>