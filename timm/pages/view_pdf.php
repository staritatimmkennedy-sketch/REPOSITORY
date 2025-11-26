<?php
// pages/view_pdf.php
session_start();

if (!isset($_SESSION['user_id']) || !in_array($_SESSION['role'], ['Dean', 'Librarian', 'Student'])) {
    http_response_code(403);
    exit;
}

$file = $_GET['file'] ?? '';
if (!$file) exit('No file');

// --- CHANGE HERE: Use ethan/uploads/ ---
$base = realpath(__DIR__ . '/../uploads/');  // ← ethan/uploads/
$path = realpath($base . '/' . basename($file));

if (!$path || strpos($path, $base) !== 0 || !file_exists($path)) {
    http_response_code(404);
    exit;
}

header('Content-Type: application/pdf');
header('Content-Disposition: inline; filename="' . basename($path) . '"');
header('Cache-Control: private, no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');
readfile($path);
exit;
?>