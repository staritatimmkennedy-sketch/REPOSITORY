<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
header('Content-Type: text/plain; charset=utf-8');
require __DIR__ . '/../db.php';

error_log("Student Session Debug: " . print_r($_SESSION, true));

if (empty($_SESSION['user_id']) || empty($_SESSION['role']) || strtoupper($_SESSION['role']) !== 'STUDENT') {
    error_log("Unauthorized access: user_id=" . ($_SESSION['user_id'] ?? 'not set') . ", role=" . ($_SESSION['role'] ?? 'not set'));
    http_response_code(403);
    echo "Unauthorized access.";
    exit;
}

$callNumber = isset($_GET['call_number']) ? trim($_GET['call_number']) : '';

if ($callNumber === '') {
    error_log("Invalid call number: " . print_r($_GET, true));
    http_response_code(400);
    echo "Invalid call number.";
    exit;
}

try {
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $sql = "
        SELECT m.materialFile 
        FROM material m 
        INNER JOIN material_submission ms ON m.material_id = ms.material_id 
        INNER JOIN material_publishing mp ON ms.materialSubmission_id = mp.materialSubmission_id 
        INNER JOIN material_borrowing mb ON mp.callNumber = mb.callNumber 
        WHERE mb.callNumber = :callNumber 
        AND mb.student_id = :student_id 
        AND mb.borrowStatus = 'APPROVED'
    ";
    
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':callNumber', $callNumber, PDO::PARAM_STR);
    $stmt->bindParam(':student_id', $_SESSION['user_id'], PDO::PARAM_STR);
    $stmt->execute();
    
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($row) {
        echo $row['materialFile'] ?: "No content available.";
    } else {
        error_log("No material found for callNumber=$callNumber, student_id={$_SESSION['user_id']}");
        http_response_code(404);
        echo "Material not found or not approved for borrowing.";
    }
} catch (PDOException $e) {
    error_log("Query failed: " . $e->getMessage());
    http_response_code(500);
    echo "Error retrieving material content.";
}
?>