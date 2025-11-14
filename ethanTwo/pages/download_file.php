<?php
session_start();
$allowed = ['Dean', 'Librarian', 'Student'];
if (!isset($_SESSION['user_id']) || !in_array($_SESSION['role'], $allowed)) {
    http_response_code(403);
    exit('Unauthorized');
}

$file = $_GET['file'] ?? '';
if (!$file) {
    http_response_code(400);
    exit('File parameter is required');
}

// Security check
if (strpos($file, '..') !== false || strpos($file, '/') !== false) {
    http_response_code(400);
    exit('Invalid file name');
}

$path = realpath(__DIR__ . '/../uploads/' . $file);

// Check if file exists
if (!$path || !file_exists($path)) {
    http_response_code(404);
    exit('File not found');
}

// Force download
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="' . basename($file) . '"');
header('Content-Length: ' . filesize($path));
readfile($path);
exit;
?>