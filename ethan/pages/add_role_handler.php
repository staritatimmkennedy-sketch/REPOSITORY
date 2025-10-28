<?php
// pages/add_role_handler.php

session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/../db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    // Read data from $_POST
    $roleName = trim($_POST['role_name'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $permissions = $_POST['permissions'] ?? [];

    if (empty($roleName)) {
        throw new Exception('Role name is required');
    }

    if (!isset($conn) || !($conn instanceof PDO)) {
        throw new Exception('Database connection unavailable');
    }

    // Check if role already exists
    $checkStmt = $conn->prepare("SELECT COUNT(*) FROM role WHERE roleName = ?");
    $checkStmt->execute([$roleName]);
    if ($checkStmt->fetchColumn() > 0) {
        throw new Exception('Role name already exists');
    }

    // Start transaction
    $conn->beginTransaction();

    try {
        // Get next role ID
        $stmt = $conn->query("SELECT COALESCE(MAX(role_id), 0) + 1 as next_id FROM role");
        $nextId = $stmt->fetchColumn();
        
        // Insert role directly (bypassing the broken stored procedure)
        $insertStmt = $conn->prepare("INSERT INTO role (role_id, roleName, description) VALUES (?, ?, ?)");
        $insertStmt->execute([$nextId, $roleName, $description ?: null]);
        
        $rowCount = $insertStmt->rowCount();
        
        if ($rowCount === 0) {
            throw new Exception('Failed to insert role');
        }

        // Insert permissions if any (optional - your table exists but might not be used yet)
        if (!empty($permissions)) {
            $allowedPerms = [
                'borrow_material', 'return_material', 'publish_material',
                'approve_publish', 'submit_material', 'approve_submission',
                'manage_users', 'manage_roles', 'manage_courses', 'manage_materials'
            ];
            $permissions = array_intersect($permissions, $allowedPerms);
            
            if (!empty($permissions)) {
                $permStmt = $conn->prepare("INSERT INTO role_permissions (role_id, permission) VALUES (?, ?)");
                foreach ($permissions as $perm) {
                    $permStmt->execute([$nextId, $perm]);
                }
            }
        }

        $conn->commit();

        // Return success response
        echo json_encode([
            'success' => true,
            'message' => 'Role added successfully!',
            'role' => [
                'role_id' => (int)$nextId,
                'role_name' => $roleName,
                'description' => $description ?: ''
            ]
        ]);

    } catch (Exception $e) {
        $conn->rollBack();
        throw $e;
    }

} catch (Exception $e) {
    error_log("Add role error: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
    exit;
}
?>