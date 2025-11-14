<?php
// Get environment variables from Railway MySQL
$db_host = getenv('mysql.railway.internal');
$db_username = getenv('library_repository_db');
$db_password = getenv('zHoqJftiBratOikAHUOapfORUUBiHDFd');
$db_name = getenv('railway');
$db_port = getenv('3306');

$dsn = "mysql:host=$db_host;port=$db_port;dbname=$db_name;charset=utf8mb4";

$conn = null;

try {
    $conn = new PDO($dsn, $db_username, $db_password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
    error_log("Database connected successfully to: $db_host");
} catch (PDOException $e) {
    error_log("DB Connection failed: " . $e->getMessage());
    error_log("Connection details - Host: $db_host, DB: $db_name, User: $db_username");
    die("Sad");
}
?>