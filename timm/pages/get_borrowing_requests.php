<?php
session_start();
require __DIR__ . '/../db.php';

header('Content-Type: application/json');

// Only librarians and admins can view borrowing requests
if (!isset($_SESSION['user_id']) || ($_SESSION['role'] !== 'Librarian' && $_SESSION['role'] !== 'Admin')) {
    echo json_encode(["error" => "Unauthorized access"]);
    exit;
}

try {
    // Call the stored procedure
    $stmt = $conn->prepare("CALL sp_getBorrowingRequests()");
    $stmt->execute();
    
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Clear any remaining result sets
    while ($stmt->nextRowset()) {
        // Consume remaining result sets
    }
    $stmt->closeCursor();

    echo json_encode($results);
    
} catch (PDOException $e) {
    error_log("Database error in get_borrowing_requests.php: " . $e->getMessage());
    echo json_encode(["error" => "Database error occurred: " . $e->getMessage()]);
}
?>