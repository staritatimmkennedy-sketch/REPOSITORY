<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require __DIR__ . '/../db.php';

header('Content-Type: application/json');

try {
    if (!isset($_SESSION['user_id'])) {
        throw new Exception("User not authenticated");
    }

    $userId = $_SESSION['user_id'];
    
    $stmt = $conn->prepare("CALL sp_getUserSubmissionsTwo(?)");
    $stmt->bindParam(1, $userId, PDO::PARAM_STR);
    $stmt->execute();
    
    $submissions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $stmt->closeCursor();
    
    echo json_encode($submissions);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>