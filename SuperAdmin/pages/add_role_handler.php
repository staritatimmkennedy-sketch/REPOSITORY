<?php
// pages/add_role_handler.php
session_start();

// Include database connection
require_once __DIR__ . '/../db.php';

header('Content-Type: 'application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
        exit;
    }
    
    $roleName = trim($data['roleName'] ?? '');
    $description = trim($data['description'] ?? '');
    $permissions = $data['permissions'] ?? [];
    
    // Validate required fields
    if (empty($roleName)) {
        echo json_encode(['success' => false, 'message' => 'Role name is required']);
        exit;
    }
    
    // Check database connection
    if (!$conn) {
        // Simulate success for demo purposes
        $newRole = [
            'role_name' => $roleName,
            'description' => $description
        ];
        
        echo json_encode([
            'success' => true, 
            'message' => 'Role added successfully (demo mode - database not connected)',
            'role' => $newRole
        ]);
        exit;
    }
    
    // Database operations
    $stmt = $conn->prepare("SELECT COALESCE(MAX(role_id), 0) + 1 as new_id FROM role");
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $newRoleId = $result['new_id'];
    
    // Convert permissions to JSON
    $permissionsJson = !empty($permissions) ? json_encode($permissions) : null;
    
    // Check if role already exists
    $checkStmt = $conn->prepare("SELECT COUNT(*) as count FROM role WHERE roleName = ?");
    $checkStmt->execute([$roleName]);
    $roleExists = $checkStmt->fetch(PDO::FETCH_ASSOC)['count'] > 0;
    
    if ($roleExists) {
        echo json_encode(['success' => false, 'message' => 'Role already exists']);
        exit;
    }
    
    // Insert new role
    $columnCheck = $conn->prepare("SHOW COLUMNS FROM role LIKE 'description'");
    $columnCheck->execute();
    $descriptionColumnExists = $columnCheck->rowCount() > 0;
    
    if ($descriptionColumnExists) {
        $insertStmt = $conn->prepare("INSERT INTO role (role_id, roleName, description, permissions) VALUES (?, ?, ?, ?)");
        $insertStmt->execute([$newRoleId, $roleName, $description, $permissionsJson]);
    } else {
        $insertStmt = $conn->prepare("INSERT INTO role (role_id, roleName) VALUES (?, ?)");
        $insertStmt->execute([$newRoleId, $roleName]);
    }
    
    // Return the new role data
    $newRoleStmt = $conn->prepare("SELECT role_id, roleName as role_name, COALESCE(description, '') as description FROM role WHERE role_id = ?");
    $newRoleStmt->execute([$newRoleId]);
    $newRole = $newRoleStmt->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true, 
        'message' => 'Role added successfully',
        'role' => $newRole
    ]);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>