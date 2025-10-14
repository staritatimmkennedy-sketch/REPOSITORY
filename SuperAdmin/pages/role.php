<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$conn = null;
$dbConnected = false;
$roles = [];
$roleOptions = [];

try {
    require_once __DIR__ . '/../db.php';

    if (isset($conn) && $conn instanceof PDO) {
        $dbConnected = true;

        // Test query
        $stmt = $conn->query("SELECT 1");
        if (!$stmt) {
            throw new Exception("Basic query failed");
        }

        // Fetch real roles
        $stmt = $conn->query("
            SELECT role_id, roleName AS role_name, 
                   COALESCE(description, '') AS description 
            FROM role 
            ORDER BY role_id ASC
        ");
        $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);

    } else {
        throw new Exception("PDO not available after including db.php");
    }
} catch (Exception $e) {
    $dbConnected = false;
    $error = "Role page error: " . $e->getMessage();
    error_log($error);
    echo "<!-- ERROR: " . htmlspecialchars($error) . " -->";
}

$roleOptions = array_unique(array_column($roles, 'role_name'));

// Define permissions for the modals
$allPermissions = [
    'borrow_material' => 'Borrow Materials',
    'return_material' => 'Return Materials',
    'publish_material' => 'Publish Materials',
    'approve_publish' => 'Approve Publishing',
    'submit_material' => 'Submit Materials',
    'approve_submission' => 'Approve Submissions',
    'manage_users' => 'Manage Users',
    'manage_roles' => 'Manage Roles',
    'manage_courses' => 'Manage Colleges / Courses',
    'manage_materials' => 'Manage Materials'
];

include 'role.html';
include 'add_role_modal.php';
include 'update_role_modal.html';
include 'delete_role_modal.html';
?>