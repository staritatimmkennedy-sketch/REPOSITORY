<?php
require_once __DIR__ . "/../db.php";

header('Content-Type: application/json');

try {
    // Call the stored procedure
    $stmt = $conn->prepare("CALL sp_getApprovedSubmissions()");
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Debug: Check what's being returned
    error_log("Approved submissions count: " . count($results));
    
    echo json_encode($results);
    
} catch (PDOException $e) {
    error_log("Database error in get_approvedSubmissions.php: " . $e->getMessage());
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>