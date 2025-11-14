<?php
session_start();
require __DIR__ . '/../db.php';

header('Content-Type: application/json');

// Get POST data  
$submission_id = $_POST['submission_id'] ?? '';
$status = $_POST['status'] ?? '';
$librarian_id = $_SESSION['user_id'] ?? '';

// Validate inputs
if (empty($submission_id)) {
    echo json_encode(['success' => false, 'error' => 'Submission ID is required']);
    exit;
}

if (empty($status)) {
    echo json_encode(['success' => false, 'error' => 'Status is required']);
    exit;
}

if (empty($librarian_id)) {
    echo json_encode(['success' => false, 'error' => 'Librarian not logged in']);
    exit;
}

// ✅ FIXED: Use 'Approved' and 'Rejected' with proper case
$allowed_statuses = ['Approved', 'Rejected'];
if (!in_array($status, $allowed_statuses)) {
    echo json_encode(['success' => false, 'error' => 'Invalid status. Use Approved or Rejected']);
    exit;
}

try {
    // ✅ Update material_publishing table (Librarian's decision)
    $sql = "UPDATE material_publishing 
            SET librarianPublishingStatus = ?, librarian_id = ?, librarianPublishingDate = NOW() 
            WHERE materialSubmission_id = ?";
    
    $stmt = $conn->prepare($sql);
    $success = $stmt->execute([$status, $librarian_id, $submission_id]);
    
    if ($success) {
        $rowCount = $stmt->rowCount();
        
        if ($rowCount > 0) {
            echo json_encode([
                'success' => true, 
                'message' => "Material $status by Librarian",
                'rows_affected' => $rowCount
            ]);
        } else {
            echo json_encode([
                'success' => false, 
                'error' => 'No rows affected - submission may not be approved yet'
            ]);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Database execution failed']);
    }
    
} catch (PDOException $e) {
    error_log("Database error in update_librarian_decision.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Database error']);
}
?>