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
            ORDER BY role_id DESC
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
include 'role.html';
?>