<?php
session_start();
if (empty($_SESSION['user_id'])) {
    http_response_code(403);
    exit('Forbidden');
}

$file = $_GET['file'] ?? '';
$base = __DIR__ . '/';               // root of your project
$path = realpath($base . $file);

if (!$path || !str_starts_with($path, $base) || !file_exists($path)) {
    http_response_code(404);
    exit('File not found');
}

$mime = mime_content_type($path) ?: 'application/octet-stream';
header('Content-Type: ' . $mime);
header('Content-Disposition: inline; filename="' . basename($path) . '"');
header('Content-Length: ' . filesize($path));
readfile($path);
exit;
?>