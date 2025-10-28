<?php
// pages/get_borrowed_material_content.php
session_start();
header('Content-Type: application/json');
require __DIR__ . '/../db.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'Student') {
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$callNumber = $_GET['call_number'] ?? '';
if (!$callNumber) {
    echo json_encode(['error' => 'Invalid call number']);
    exit;
}

try {
    $sql = "
        SELECT m.materialFile
        FROM material_borrowing mb
        INNER JOIN material_publishing mp ON mb.callNumber = mp.callNumber
        INNER JOIN material_submission ms ON mp.materialSubmission_id = ms.materialSubmission_id
        INNER JOIN material m ON ms.material_id = m.material_id
        WHERE mb.callNumber = :callNumber
          AND mb.student_id = :student_id
          AND mb.borrowStatus = 'APPROVED'
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':callNumber', $callNumber, PDO::PARAM_STR);
    $stmt->bindParam(':student_id', $_SESSION['user_id'], PDO::PARAM_STR);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row || empty($row['materialFile'])) {
        echo json_encode(['error' => 'File not found']);
        exit;
    }

    $filename = basename($row['materialFile']);
    echo json_encode(['file' => $filename]);

} catch (Exception $e) {
    error_log("Student view error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Server error']);
}
?>