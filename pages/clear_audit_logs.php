<?php
// pages/clear_audit_logs.php
header('Content-Type: application/json');
if (session_status() === PHP_SESSION_NONE) session_start();
require_once __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_POST['confirm']) || $_POST['confirm'] !== 'yes') {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit;
}

if (!isset($_SESSION['user_id']) || ($_SESSION['role_id'] ?? 0) != 1) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

try {
    if (!$conn || !($conn instanceof PDO)) {
        throw new Exception('Database connection unavailable');
    }

    // Count before clearing
    $count = $conn->query("SELECT COUNT(*) FROM audit_log")->fetchColumn();

    // Log the clear action
    $adminId = $_SESSION['user_id'];
    $description = "Admin cleared ALL audit logs (total: $count entries)";

    $logStmt = $conn->prepare("
        INSERT INTO audit_log (user_id, action_type, description) 
        VALUES (?, 'clear_logs', ?)
    ");
    $logStmt->execute([$adminId, $description]);

    // Delete all logs
    $conn->exec("DELETE FROM audit_log");

    echo json_encode([
        'success' => true,
        'message' => 'All audit logs cleared successfully!'
    ]);

} catch (Exception $e) {
    error_log("Clear logs error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Failed to clear logs: ' . $e->getMessage()]);
}
?>