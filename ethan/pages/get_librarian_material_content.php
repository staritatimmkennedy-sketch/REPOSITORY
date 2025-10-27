<?php
include '../db.php';
session_start();

error_log("Librarian Session Debug: " . print_r($_SESSION, true));

if (!isset($_SESSION['user_id']) || !isset($_SESSION['role']) || strtoupper($_SESSION['role']) !== 'LIBRARIAN') {
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
            AND ms.approvalStatus = 'APPROVED'
        ";
        $params = [':submission_id' => $submission_id];

        error_log("Librarian query: $sql with params: " . print_r($params, true));

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':submission_id', $submission_id, PDO::PARAM_INT);
        $stmt->execute();
        
        $row = $stmt->fetch();
        
        if ($row) {
            error_log("Material found for submission_id $submission_id");
            header('Content-Type: text/plain; charset=utf-8');
            echo $row['materialFile'] ?: "No content available.";
        } else {
            error_log("No material found for submission_id $submission_id");
            http_response_code(404);
            echo "Material not found or not approved.";
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
?>