<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require __DIR__ . '/../db.php';

header('Content-Type: application/json');

try {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'User not logged in']);
        exit;
    }

    $user_id = $_SESSION['user_id'];

    $sql = "
        SELECT callNumber, borrowStatus
        FROM material_borrowing
        WHERE student_id = :uid
          AND callNumber IS NOT NULL
          AND callNumber <> ''
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':uid', $user_id, PDO::PARAM_STR);
    $stmt->execute();

    $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success'  => true,
        'requests' => $requests
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error'   => 'Database error: ' . $e->getMessage()
    ]);
}
