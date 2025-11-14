<?php
session_start();
$allowed = ['Dean', 'Librarian', 'Student'];
if (!isset($_SESSION['user_id']) || !in_array($_SESSION['role'], $allowed)) {
    http_response_code(403);
    exit('Unauthorized');
}
$file = $_GET['file'] ?? '';
if (!$file || strpos($file, '..') !== false || strpos($file, '/') !== false) {
    http_response_code(400);
    exit('Invalid file');
}
$path = realpath(__DIR__ . '/../uploads/' . $file);
if (!$path || !file_exists($path) || pathinfo($path, PATHINFO_EXTENSION) !== 'pdf') {
    http_response_code(404);
    exit('File not found');
}

// Check if download is requested
if (isset($_GET['download']) && $_GET['download'] == '1') {
    // Force download with proper headers
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . basename($file) . '"');
    header('Content-Transfer-Encoding: binary');
    header('Content-Length: ' . filesize($path));
    header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
    header('Pragma: public');
    header('Expires: 0');
    
    // Clear output buffer
    if (ob_get_level()) {
        ob_end_clean();
    }
} else {
    // Normal view in browser
    header('Content-Type: application/pdf');
    header('Access-Control-Allow-Origin: *');
    header('Cache-Control: no-cache, no-store');
    header('Pragma: no-cache');
    header('Expires: 0');
}

readfile($path);
exit;
?>