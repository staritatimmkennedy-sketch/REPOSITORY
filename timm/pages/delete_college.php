<?php
// pages/delete_college.php

header('Content-Type: application/json');
require_once __DIR__ . '/../db.php'; // Adjust path if necessary

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$collegeId = trim($_POST['college_id'] ?? '');

if (empty($collegeId) || !is_numeric($collegeId)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid College ID']);
    exit;
}

try {
    if (!isset($conn) || !($conn instanceof PDO)) {
        throw new Exception('Database connection unavailable');
    }

    $conn->beginTransaction();

    // **CRITICAL DEPENDENCY CHECK**
    // Check if the college is linked to any courses before deleting.
    // NOTE: This assumes your 'course' table has a 'college_id' foreign key.
    $checkCourseStmt = $conn->prepare("SELECT COUNT(*) FROM course WHERE college_id = ?");
    $checkCourseStmt->execute([$collegeId]);
    $courseCount = $checkCourseStmt->fetchColumn();

    if ($courseCount > 0) {
        $conn->rollBack();
        throw new Exception("Cannot delete college. $courseCount course(s) are currently assigned. Please reassign them first.");
    }
    
    // Delete the college
    $deleteStmt = $conn->prepare("DELETE FROM college WHERE college_id = ?");
    $deleteStmt->execute([$collegeId]);

    if ($deleteStmt->rowCount() === 0) {
        $conn->rollBack();
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'College not found or already deleted.']);
        exit;
    }

    $conn->commit();

    echo json_encode([
        'success' => true,
        'message' => 'College deleted successfully!',
        'college_id' => $collegeId // Send back the ID to remove the row
    ]);

} catch (Exception $e) {
    // Attempt rollback if transaction was started
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    http_response_code(500);
    error_log("Error deleting college: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>