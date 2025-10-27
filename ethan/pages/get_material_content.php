<?php
// Include database connection
include '../db.php'; // Adjusted to match your provided file name

session_start();

// Debug: Log session variables
error_log("Session Debug: " . print_r($_SESSION, true));

// Check if dean is logged in
if (!isset($_SESSION['user_id']) || !isset($_SESSION['role']) || $_SESSION['role'] !== 'Dean' || $_SESSION['role'] !== 'Librarian') {
    http_response_code(403);
    echo "Unauthorized access. Session: " . json_encode($_SESSION);
    exit;
}

$submission_id = isset($_GET['submission_id']) ? (int)$_GET['submission_id'] : 0;

if ($submission_id > 0) {
    try {
        $sql = "
            SELECT m.materialFile 
            FROM material_submission ms 
            INNER JOIN material m ON m.material_id = ms.material_id 
            WHERE ms.materialSubmission_id = :submission_id
            AND ms.dean_id = :dean_id
        ";
        
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':submission_id', $submission_id, PDO::PARAM_INT);
        $stmt->bindParam(':dean_id', $_SESSION['user_id'], PDO::PARAM_STR);
        $stmt->execute();
        
        $row = $stmt->fetch();
        
        if ($row) {
            header('Content-Type: text/plain; charset=utf-8');
            echo $row['materialFile'] ?: "No content available.";
        } else {
            http_response_code(404);
            echo "Material not found or you are not authorized to view it.";
        }
    } catch (PDOException $e) {
        error_log("Query failed: " . $e->getMessage());
        http_response_code(500);
        echo "Error retrieving material content.";
    }
} else {
    http_response_code(400);
    echo "Invalid submission ID.";
}

// No need to close PDO connection explicitly; it closes when script ends
?>