<?php
// audit_logs.php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/../db.php';
if (!$conn || !($conn instanceof PDO)) {
    die("Database connection failed.");
}

// === CSV EXPORT (MUST BE FIRST) ===
if (isset($_GET['export']) && $_GET['export'] === 'csv') {
    // Only admins can export
    if (!isset($_SESSION['user_id']) || ($_SESSION['role_id'] ?? 0) != 1) {
        http_response_code(403);
        die("Access denied.");
    }

    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="audit_logs_' . date('Y-m-d_His') . '.csv"');
    
    $output = fopen('php://output', 'w');
    fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF)); // BOM

    fputcsv($output, ['ID', 'Timestamp', 'User ID', 'Username', 'Action', 'Description']);

    $stmt = $conn->query("
        SELECT al.log_id, al.timestamp, al.user_id, u.username, al.action_type, al.description
        FROM audit_log al
        LEFT JOIN user u ON al.user_id = u.user_id
        ORDER BY al.timestamp DESC
    ");

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        fputcsv($output, [
            $row['log_id'],
            $row['timestamp'],
            $row['user_id'],
            $row['username'] ?? 'system',
            strtoupper($row['action_type']),
            $row['description']
        ]);
    }
    exit;
}

// === NOW DO SESSION CHECKS (AFTER EXPORT) ===
if (!isset($_SESSION['user_id'])) {
    die('<div class="flex items-center justify-center h-screen bg-gray-100">
            <div class="bg-white p-8 rounded-lg shadow-md text-center">
                <h1 class="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
                <p class="text-gray-700">Please <a href="../loginOne.php" class="text-green-600 hover:underline">log in</a>.</p>
            </div>
         </div>');
}

if (!isset($_SESSION['role_id']) || $_SESSION['role_id'] != 1) {
    $currentRole = $_SESSION['role'] ?? 'Unknown';
    die('<div class="flex items-center justify-center h-screen bg-gray-100">
            <div class="bg-white p-8 rounded-lg shadow-md text-center">
                <h1 class="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
                <p class="text-gray-700">This page is for <strong>Admins only</strong>.</p>
                <p class="text-sm text-gray-500 mt-2">Your role: <strong>' . htmlspecialchars($currentRole) . '</strong></p>
            </div>
         </div>');
}

// === FETCH LOGS FOR DISPLAY ===
$logs = [];
try {
    $stmt = $conn->query("
        SELECT al.*, u.username 
        FROM audit_log al 
        LEFT JOIN user u ON al.user_id = u.user_id 
        ORDER BY al.timestamp DESC
        LIMIT 1000
    ");
    $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {
    error_log("Audit log error: " . $e->getMessage());
    $logs = [];
}
include 'logs.html';
?>