<?php
$db_host = getenv('mysql.railway.internal') ?: 'localhost';
$db_username = getenv('root') ?: 'root';
$db_password = getenv('zHoqJftiBratOikAHUOapfORUUBiHDFd') ?: '';
$db_name = getenv('railway') ?: 'library_repository_db';
$db_port = getenv('3306') ?: '3306';
$dsn = "mysql:host=$db_host;port=$db_port;dbname=$db_name;charset=utf8mb4";
$conn = null;

try {
    $conn = new PDO($dsn, $db_username, $db_password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    error_log("DB Connection failed: " . $e->getMessage());
    if (getenv('RAILWAY_ENVIRONMENT')) {
        die("Database connection error. Please try again later.");
    } else {
        die("DB Connection failed: " . $e->getMessage());
    }
}
?>