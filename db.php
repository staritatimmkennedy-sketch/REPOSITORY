<?php
$db_host = getenv('mysql.railway.internal') ?: 'localhost';
$db_username = getenv('library_repository_db') ?: 'root';
$db_password = getenv('zHoqJftiBratOikAHUOapfORUUBiHDFd') ?: '';
$db_name = getenv('railway') ?: 'library_repository_db';
$db_port = getenv('3306') ?: '3306';

$hosts_to_try = [
    $db_host,
    'railway-mysql.railway.internal',
    'mysql.railway.internal'
];

$conn = null;
$last_error = '';

foreach ($hosts_to_try as $try_host) {
    $dsn = "mysql:host=$try_host;port=$db_port;dbname=$db_name;charset=utf8mb4";
    
    try {
        $conn = new PDO($dsn, $db_username, $db_password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT => 5
        ]);
        error_log("Database connected successfully to: $try_host");
        break; 
    } catch (PDOException $e) {
        $last_error = $e->getMessage();
        error_log("Connection failed to $try_host: " . $e->getMessage());
        continue; 
    }
}

if (!$conn) {
    error_log("All database connection attempts failed. Last error: " . $last_error);
}
?>