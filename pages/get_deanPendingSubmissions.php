<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json');
require __DIR__ . '/../db.php';

// 1. Get logged-in dean ID
$deanId = $_SESSION['user_id'] ?? null;

if (!$deanId) {
    echo json_encode(["error" => "No dean logged in"]);
    exit;
}

try {
    // Debug: Test the dean ID
    error_log("Dean ID from session: " . $deanId);
    
    // Test if stored procedure exists and works
    $testStmt = $conn->prepare("SELECT COUNT(*) as proc_exists FROM information_schema.ROUTINES WHERE ROUTINE_NAME = 'sp_getDeanSubmissionsTwo' AND ROUTINE_TYPE = 'PROCEDURE'");
    $testStmt->execute();
    $procCheck = $testStmt->fetch(PDO::FETCH_ASSOC);
    error_log("Stored procedure exists: " . ($procCheck['proc_exists'] ? 'YES' : 'NO'));
    
    // Call the stored procedure
    $stmt = $conn->prepare("CALL sp_getDeanSubmissionsTwo(?)");
    if (!$stmt) {
        throw new Exception("Failed to prepare stored procedure: " . implode(", ", $conn->errorInfo()));
    }
    
    $stmt->bindParam(1, $deanId, PDO::PARAM_STR);
    $success = $stmt->execute();
    
    if (!$success) {
        $errorInfo = $stmt->errorInfo();
        throw new Exception("Stored procedure execution failed: " . ($errorInfo[2] ?? 'Unknown error'));
    }

    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    error_log("Number of rows returned: " . count($results));
    
    // Debug: Log first few rows
    if (count($results) > 0) {
        error_log("First row sample: " . json_encode($results[0]));
    }
    
    // Handle multiple result sets if any
    while ($stmt->nextRowset()) { 
        // Consume any additional result sets
    }
    $stmt->closeCursor();

    echo json_encode($results);
    
} catch (PDOException $e) {
    error_log("PDO Exception: " . $e->getMessage());
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
} catch (Exception $e) {
    error_log("General Exception: " . $e->getMessage());
    echo json_encode(["error" => "Error: " . $e->getMessage()]);
}
?>