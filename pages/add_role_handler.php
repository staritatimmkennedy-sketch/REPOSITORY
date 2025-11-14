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
    $roleName     = trim($_POST['role_name'] ?? '');
    $description  = trim($_POST['description'] ?? '');
    $permissions  = $_POST['permissions'] ?? [];

    if (empty($roleName)) {
        throw new Exception('Role name is required');
    }

    if (!isset($conn) || !($conn instanceof PDO)) {
        throw new Exception('Database connection unavailable');
    }

    // === CHECK IF ROLE EXISTS ===
    $checkStmt = $conn->prepare("SELECT COUNT(*) FROM role WHERE roleName = ?");
    $checkStmt->execute([$roleName]);
    if ($checkStmt->fetchColumn() > 0) {
        throw new Exception('Role name already exists');
    }

    // === START TRANSACTION ===
    $conn->beginTransaction();

    try {
        // === GET NEXT ROLE ID ===
        $stmt = $conn->query("SELECT COALESCE(MAX(role_id), 0) + 1 AS next_id FROM role");
        $nextId = $stmt->fetchColumn();

        // === INSERT ROLE ===
        $insertStmt = $conn->prepare("
            INSERT INTO role (role_id, roleName, description) 
            VALUES (?, ?, ?)
        ");
        $insertStmt->execute([$nextId, $roleName, $description ?: null]);

        if ($insertStmt->rowCount() === 0) {
            throw new Exception('Failed to insert role');
        }

        // === INSERT PERMISSIONS (if any) ===
        if (!empty($permissions)) {
            $allowedPerms = [
                'borrow_material', 'return_material', 'publish_material',
                'approve_publish', 'submit_material', 'approve_submission',
                'manage_users', 'manage_roles', 'manage_courses', 'manage_materials'
            ];
            $permissions = array_intersect($permissions, $allowedPerms);

            if (!empty($permissions)) {
                $permStmt = $conn->prepare("
                    INSERT INTO role_permissions (role_id, permission) 
                    VALUES (?, ?)
                ");
                foreach ($permissions as $perm) {
                    $permStmt->execute([$nextId, $perm]);
                }
            }
        }

        // === AUDIT LOG: ROLE CREATED ===
        $currentUserId = $_SESSION['user_id'] ?? 'unknown';
        $permList = !empty($permissions) ? implode(', ', $permissions) : 'none';
        $description = "Created new role ID $nextId: '$roleName' (Permissions: $permList)";

        $logStmt = $conn->prepare("
            INSERT INTO audit_log (user_id, action_type, description) 
            VALUES (?, 'create', ?)
        ");
        $logStmt->execute([$currentUserId, $description]);

        // === COMMIT ===
        $conn->commit();

        // === SUCCESS RESPONSE ===
        echo json_encode([
            'success' => true,
            'message' => 'Role added successfully!',
            'role' => [
                'role_id'     => (int)$nextId,
                'role_name'   => $roleName,
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