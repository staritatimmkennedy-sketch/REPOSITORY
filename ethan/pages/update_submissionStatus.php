<?php
session_start();
require __DIR__ . '/../db.php';

header('Content-Type: application/json');

// Get POST data
$submission_id = $_POST['submission_id'] ?? '';
$status = $_POST['status'] ?? '';
$dean_id = $_SESSION['user_id'] ?? '';

// Log the received data for debugging
error_log("Update Submission - Submission ID: $submission_id, Status: $status, Dean ID: $dean_id");

// Validate inputs
if (empty($submission_id)) {
    echo json_encode(['success' => false, 'error' => 'Submission ID is required']);
    exit;
}

if (empty($status)) {
    echo json_encode(['success' => false, 'error' => 'Status is required']);
    exit;
}

if (empty($dean_id)) {
    echo json_encode(['success' => false, 'error' => 'Dean not logged in']);
    exit;
}

// Validate status value
$allowed_statuses = ['APPROVED', 'DENIED'];
if (!in_array(strtoupper($status), $allowed_statuses)) {
    echo json_encode(['success' => false, 'error' => 'Invalid status. Use APPROVED or DENIED']);
    exit;
}

try {
    // Update the submission
    $sql = "UPDATE material_submission 
            SET approvalStatus = ?, dean_id = ?, approvalDate = NOW() 
            WHERE materialSubmission_id = ?";
    
    $stmt = $conn->prepare($sql);
    $success = $stmt->execute([$status, $dean_id, $submission_id]);
    
    if ($success) {
        $rowCount = $stmt->rowCount();
        
        if ($rowCount > 0) {
            echo json_encode([
                'success' => true, 
                'message' => "Submission $status successfully",
                'rows_affected' => $rowCount
            ]);
        } else {
            echo json_encode([
                'success' => false, 
                'error' => 'No rows affected - submission may not exist'
            ]);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Database execution failed']);
    }
    
} catch (PDOException $e) {
    $error_message = $e->getMessage();
    error_log("Database error in update_submission_status.php: " . $error_message);
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $error_message]);
} catch (Exception $e) {
    $error_message = $e->getMessage();
    error_log("General error in update_submission_status.php: " . $error_message);
    echo json_encode(['success' => false, 'error' => 'Error: ' . $error_message]);
}
?>