<?php
session_start();
require __DIR__ . '/../db.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'Student') {
    echo json_encode(['success' => false, 'error' => 'Unauthorized access']);
    exit;
}

try {
    $publishing_id = $_POST['publishing_id'] ?? '';
    $call_number = $_POST['call_number'] ?? '';
    $borrow_remarks = $_POST['borrow_remarks'] ?? '';
    $expected_return = $_POST['expected_return'] ?? '';
    $student_id = $_SESSION['user_id'];

    // Validate required fields
    if (empty($publishing_id) || empty($call_number) || empty($borrow_remarks) || empty($expected_return)) {
        echo json_encode(['success' => false, 'error' => 'All fields are required']);
        exit;
    }

    // Format expected return date for database
    $due_date = date('Y-m-d H:i:s', strtotime($expected_return . ' 23:59:59'));

    // Call stored procedure
    $stmt = $conn->prepare("CALL sp_requestBorrowing(?, ?, ?, ?, ?)");
    $stmt->execute([$student_id, $publishing_id, $call_number, $borrow_remarks, $due_date]);
    
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Clear any remaining result sets
    while ($stmt->nextRowset()) {}
    $stmt->closeCursor();

    if ($result && isset($result['rowcount']) && $result['rowcount'] > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Borrowing request submitted successfully'
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => $result['message'] ?? 'Request failed']);
    }

} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Database error occurred']);
}
?>