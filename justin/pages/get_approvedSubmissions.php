<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json');
require __DIR__ . '/../db.php';

// Check if user is librarian
$user_id = $_SESSION['user_id'] ?? null;
$user_role = $_SESSION['role'] ?? null;

if (!$user_id || $user_role !== 'Librarian') {
    echo json_encode(["error" => "Unauthorized access. Librarian role required."]);
    exit;
}

try {
    $stmt = $conn->prepare("CALL sp_getApprovedMaterialsForPublishingTwo()");
    $stmt->execute();
    
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Clear any remaining result sets
    while ($stmt->nextRowset()) {
        // Consume remaining result sets
    }
    $stmt->closeCursor();

    echo json_encode($results);
    
} catch (PDOException $e) {
    error_log("Database error in get_approved_materials.php: " . $e->getMessage());
    echo json_encode(["error" => "Database error occurred"]);
}
?>