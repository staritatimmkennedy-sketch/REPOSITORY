<?php
session_start();
header('Content-Type: application/json');
if (!isset($_SESSION['user_id']) || !isset($_SESSION['role'])) {
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}
$callNumber = $_GET['call_number'] ?? '';
if (!$callNumber) {
    echo json_encode(['error' => 'Invalid call number']);
    exit;
}
require _DIR_ . '/../db.php';
try {
    $sql = "
        SELECT m.materialFile
        FROM material_borrowing mb
        JOIN material_publishing mp ON mb.callNumber = mp.callNumber
        JOIN material_submission ms ON mp.materialSubmission_id = ms.materialSubmission_id
        JOIN material m ON ms.material_id = m.material_id
        WHERE mb.callNumber = ? AND mb.student_id = ? AND mb.borrowStatus = 'APPROVED'
    ";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$callNumber, $_SESSION['user_id']]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row || empty($row['materialFile'])) {
        echo json_encode(['error' => 'File not found or not approved']);
        exit;
    }

    $filename = basename($row['materialFile']);
    echo json_encode(['file' => $filename]);

} catch (Exception $e) {
    error_log("PDF fetch error: " . $e->getMessage());
    echo json_encode(['error' => 'Server error']);
}
?>