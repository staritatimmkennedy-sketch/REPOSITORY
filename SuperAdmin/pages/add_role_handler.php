<?php
// pages/add_role_handler.php

session_start();

// Include database connection
require_once __DIR__ . '/../db.php';

// FIX 1: Corrected header syntax
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    // FIX 2: Read data from $_POST (Standard form submission)
    $roleName = trim($_POST['role_name'] ?? ''); // Assuming you used name="role_name" in HTML
    $description = trim($_POST['description'] ?? '');
    $permissions = $_POST['permissions'] ?? []; // This is an array if the HTML name is permissions[]

    if (empty($roleName)) {
        http_response_code(400);
        throw new Exception('Role name is required');
    }

    if (!isset($conn) || !($conn instanceof PDO)) {
        http_response_code(500);
        throw new Exception('Database connection unavailable');
    }

    // Define allowed permissions for validation
    $allowedPerms = [
        'borrow_material', 'return_material', 'publish_material',
        'approve_publish', 'submit_material', 'approve_submission',
        'manage_users', 'manage_roles', 'manage_courses', 'manage_materials'
    ];
    $permissions = array_intersect($permissions, $allowedPerms);
    
    // Check if role already exists
    $checkStmt = $conn->prepare("SELECT COUNT(*) FROM role WHERE roleName = ?");
    $checkStmt->execute([$roleName]);
    if ($checkStmt->fetchColumn() > 0) {
        http_response_code(409); // Conflict
        throw new Exception('Role name already exists');
    }

    // --- Start Transaction ---
    $conn->beginTransaction();

    // 1. Insert the new role (relying on AUTO_INCREMENT for role_id, if configured)
    $insertRoleStmt = $conn->prepare("INSERT INTO role (roleName, description) VALUES (?, ?)");
    $insertRoleStmt->execute([$roleName, $description ?: null]);
    $roleId = $conn->lastInsertId(); // Get the ID of the newly inserted role

    // Fallback if AUTO_INCREMENT is not used (your original logic, simplified)
    if (!$roleId) {
         $stmt = $conn->query("SELECT COALESCE(MAX(role_id), 0) as last_id FROM role");
         $roleId = $stmt->fetchColumn() + 1;

         // Re-run insert with manually fetched ID
         $insertRoleStmt = $conn->prepare("INSERT INTO role (role_id, roleName, description) VALUES (?, ?, ?)");
         $insertRoleStmt->execute([$roleId, $roleName, $description ?: null]);
    }

    // 2. Insert permissions for the new role
    if (!empty($permissions)) {
        $permStmt = $conn->prepare("INSERT INTO role_permissions (role_id, permission) VALUES (?, ?)");
        foreach ($permissions as $perm) {
            $permStmt->execute([$roleId, $perm]);
        }
    }

    $conn->commit();
    // --- End Transaction ---

    // 3. Prepare the data for the JavaScript table update
    $newRoleData = [
        'role_id' => (int)$roleId,
        'role_name' => $roleName,
        'description' => $description ?: '' // Ensure description is a string
    ];

    echo json_encode([
        'success' => true,
        'message' => 'Role added successfully!',
        'role' => $newRoleData
    ]);

} catch (Exception $e) {
    // If a transaction was started but failed, roll it back
    if (isset($conn) && $conn instanceof PDO && $conn->inTransaction()) {
        $conn->rollBack();
    }
    
    // Output the error message as JSON
    // Only set a generic 500 if no specific code (like 409) was set earlier
    if (http_response_code() === 200) {
         http_response_code(500);
    }
    
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
    exit;
}

?>