<?php
session_start();
require __DIR__ . '/../db.php';

header('Content-Type: application/json');

// Check if user is logged in
$user_id = $_SESSION['user_id'] ?? null;
if (!$user_id) {
    echo json_encode(['success' => false, 'error' => 'Not logged in']);
    exit;
}

// Get POST data (removed expected_return)
$publishing_id = $_POST['publishing_id'] ?? '';
$call_number = $_POST['call_number'] ?? '';
$borrow_remarks = $_POST['borrow_remarks'] ?? '';
$agree_terms = $_POST['agree_terms'] ?? 0;

// Validate inputs (removed expected_return validation)
if (empty($publishing_id) || empty($call_number) || empty($borrow_remarks) || !$agree_terms) {
    echo json_encode(['success' => false, 'error' => 'All fields are required']);
    exit;
}

try {
    // Call stored procedure (removed expected_return parameter)
    $stmt = $conn->prepare("CALL sp_requestBorrowing(?, ?, ?)");
    $stmt->execute([$user_id, $call_number, $borrow_remarks]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result && $result['rowcount'] > 0) {
        echo json_encode(['success' => true, 'borrowing_id' => $result['borrowing_id']]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Request failed. Material may be unavailable or already requested.']);
    }

} catch (Exception $e) {
    error_log("Borrowing request error: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Database error occurred.']);
}
?>