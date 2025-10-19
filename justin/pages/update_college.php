<?php
// pages/update_college.php

header('Content-Type: application/json');
require_once __DIR__ . '/../db.php'; // Adjust path if necessary

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$collegeId = trim($_POST['college_id'] ?? '');
$collegeName = trim($_POST['college_name'] ?? '');

if (empty($collegeId) || !is_numeric($collegeId)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid College ID']);
    exit;
}

if (empty($collegeName)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'College name is required']);
    exit;
}

try {
    if (!isset($conn) || !($conn instanceof PDO)) {
        throw new Exception('Database connection unavailable');
    }

    // 1. Update college details
    $updateStmt = $conn->prepare("UPDATE college SET collegeName = ? WHERE college_id = ?");
    $updateStmt->execute([$collegeName, $collegeId]);
    
    // Check if a row was actually updated
    if ($updateStmt->rowCount() > 0 || $updateStmt->errorCode() === '00000') {

        // Fetch the updated college details to send back to the client
        $updatedStmt = $conn->prepare("SELECT college_id AS id, collegeName AS name FROM college WHERE college_id = ?");
        $updatedStmt->execute([$collegeId]);
        $updatedCollege = $updatedStmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'message' => 'College updated successfully!',
            'college' => $updatedCollege
        ]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'College not found or no changes made.']);
    }

} catch (Exception $e) {
    http_response_code(500);
    error_log("Error updating college: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>