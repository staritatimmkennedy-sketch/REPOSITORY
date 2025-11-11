<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once __DIR__ . '/../db.php';

if (!$conn || !($conn instanceof PDO)) {
    die("<div class='bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-4'>
         <strong>DB Error:</strong> Connection failed. Is <code>db.php</code> in the root folder?
         </div>");
}

try {
    $conn->query("SELECT 1")->fetch();
} catch (Exception $e) {
    die("<div class='bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-4'>
         <strong>DB Test Failed:</strong> " . htmlspecialchars($e->getMessage()) . "
         </div>");
}

$roles = $conn->query("
    SELECT role_id, roleName AS role_name, COALESCE(description, '') AS description
    FROM role 
    ORDER BY role_id ASC
")->fetchAll(PDO::FETCH_ASSOC);
$roleOptions = array_unique(array_column($roles, 'role_name'));
echo "<!-- ROLES COUNT: " . count($roles) . " -->";
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