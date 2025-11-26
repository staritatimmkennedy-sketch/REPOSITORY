<?php
$db_host = 'localhost';
$db_username = 'root';
$db_password = '';
$db_name = 'library_repository_db';
$dsn = "mysql:host=$db_host;dbname=$db_name;charset=utf8mb4";

$conn = null;

try {
    $conn = new PDO($dsn, $db_username, $db_password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    error_log("DB Connection failed: " . $e->getMessage());
    $conn = null;
}
?>