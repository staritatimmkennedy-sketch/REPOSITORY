<?php
// pages/remove_submission.php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

require_once __DIR__ . '/../db.php';
$userId = $_SESSION['user_id'];

$submissionId = $_POST['submission_id'] ?? '';

// Validate required field
if (empty($submissionId)) {
    echo json_encode(['error' => 'Missing submission ID']);
    exit;
}

try {
    // First get the file path before deleting
    $stmt = $conn->prepare("SELECT m.materialFile FROM material_submission ms INNER JOIN material m ON ms.material_id = m.material_id WHERE ms.materialSubmission_id = ?");
    $stmt->bindParam(1, $submissionId, PDO::PARAM_INT);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $filePath = $result['materialFile'] ?? null;

    // Call stored procedure to remove submission
    $stmt = $conn->prepare("CALL sp_removeSubmission(?)");
    $stmt->bindParam(1, $submissionId, PDO::PARAM_INT);
    $stmt->execute();

    // Delete file if it exists
    if ($filePath && file_exists(__DIR__ . '/../' . $filePath)) {
        unlink(__DIR__ . '/../' . $filePath);
    }

    echo json_encode(['success' => true, 'message' => 'Submission removed successfully!']);

} catch (PDOException $e) {
    error_log("remove_submission.php error: " . $e->getMessage());
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>