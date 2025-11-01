<?php
session_start();
require __DIR__ . '/../db.php';

header('Content-Type: application/json');

// Check if user is logged in and is a librarian
$librarian_id = $_SESSION['user_id'] ?? null;
$user_role = $_SESSION['role'] ?? null;

if (!$librarian_id) {
    echo json_encode(['success' => false, 'error' => 'Not logged in']);
    exit;
}

if ($user_role !== 'Librarian') {
    echo json_encode(['success' => false, 'error' => 'Only librarians can publish materials']);
    exit;
}

// Get POST data
$submission_id = $_POST['submission_id'] ?? '';
$call_number = $_POST['call_number'] ?? '';

// Validate inputs
if (empty($submission_id) || empty($call_number)) {
    echo json_encode(['success' => false, 'error' => 'Submission ID and call number are required']);
    exit;
}

try {
    // Start transaction
    $conn->beginTransaction();

    // Check if call number already exists
    $check_stmt = $conn->prepare("SELECT COUNT(*) FROM material_publishing WHERE callNumber = ?");
    $check_stmt->execute([$call_number]);
    $call_number_exists = $check_stmt->fetchColumn();
    
    if ($call_number_exists > 0) {
        throw new Exception('Call number already exists. Please use a unique call number.');
    }
    
    // Check if submission exists and is approved
    $check_submission = $conn->prepare("SELECT approvalStatus FROM material_submission WHERE materialSubmission_id = ?");
    $check_submission->execute([$submission_id]);
    $submission = $check_submission->fetch(PDO::FETCH_ASSOC);
    
    if (!$submission) {
        throw new Exception('Submission not found');
    }
    
    if ($submission['approvalStatus'] !== 'APPROVED') {
        throw new Exception('Only approved materials can be published');
    }

    // Check if already published
    $check_published = $conn->prepare("SELECT COUNT(*) FROM material_publishing WHERE materialSubmission_id = ?");
    $check_published->execute([$submission_id]);
    $already_published = $check_published->fetchColumn();
    
    if ($already_published > 0) {
        throw new Exception('This material has already been published');
    }

    // Get next publishing ID
    $get_id = $conn->query("SELECT COALESCE(MAX(materialPublishing_id), 0) + 1 AS new_id FROM material_publishing");
    $new_id = $get_id->fetchColumn();

    // Insert into publishing table
    $insert = $conn->prepare("
        INSERT INTO material_publishing (
            materialPublishing_id, callNumber, librarian_id, materialSubmission_id,
            materialStatus, approvalStatus, approvalDate, submissionDate
        ) VALUES (?, ?, ?, ?, 'AVAILABLE', 'PUBLISHED', NOW(), NOW())
    ");
    $insert->execute([$new_id, $call_number, $librarian_id, $submission_id]);

    // Update submission status to PUBLISHED
    $update = $conn->prepare("UPDATE material_submission SET approvalStatus = 'PUBLISHED' WHERE materialSubmission_id = ?");
    $update->execute([$submission_id]);

    // Commit transaction
    $conn->commit();

    echo json_encode([
        'success' => true, 
        'message' => 'Material published successfully',
        'publish_id' => $new_id,
        'call_number' => $call_number
    ]);

} catch (Exception $e) {
    // Rollback transaction on error
    $conn->rollBack();
    error_log("Publishing error: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>