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
    // Call the stored procedure
    $stmt = $conn->prepare("CALL sp_publishMaterial(?, ?, ?)");
    $stmt->execute([$librarian_id, $submission_id, $call_number]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    // If we get here, it was successful
    echo json_encode([
        'success' => true, 
        'message' => $result['message'] ?? 'Material published successfully',
        'publish_id' => $result['publish_id'] ?? null,
        'call_number' => $result['call_number'] ?? $call_number
    ]);

} catch (PDOException $e) {
    // Handle database errors
    $error_code = $e->errorInfo[1];
    $error_message = $e->getMessage();
    
    error_log("PDOException - Code: $error_code, Message: $error_message");
    
    // Check if it's a duplicate entry error (MySQL error code 1062)
    if ($error_code == 1062) {
        error_log("Duplicate call number detected: $call_number");
        echo json_encode([
            'success' => false, 
            'error' => 'Call number already exists. Please use a unique call number.'
        ]);
    } else {
        // Other database errors
        echo json_encode([
            'success' => false, 
            'error' => 'Database error occurred. Please try again.'
        ]);
    }
} catch (Exception $e) {
    error_log("General Exception: " . $e->getMessage());
    echo json_encode([
        'success' => false, 
        'error' => 'An unexpected error occurred. Please try again.'
    ]);
}
exit;
?>