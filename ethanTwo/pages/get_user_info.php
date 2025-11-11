<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'Student') {
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

require __DIR__ . '/../db.php';

try {
    $stmt = $conn->prepare("
        SELECT CONCAT(firstName, ' ', IFNULL(middleName, ''), ' ', lastName) AS fullName, user_id AS userId 
        FROM user WHERE user_id = ?
    ");
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode([
            'fullName' => $user['fullName'],
            'userId' => $user['userId']
        ]);
    } else {
        echo json_encode(['fullName' => 'Student', 'userId' => $_SESSION['user_id']]);
    }
} catch (Exception $e) {
    echo json_encode(['fullName' => 'User', 'userId' => 'N/A']);
}
?>