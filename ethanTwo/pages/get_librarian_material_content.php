<?php
// pages/get_librarian_material_content.php
include '../db.php';
session_start();

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'Librarian') {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$submission_id = (int)($_GET['submission_id'] ?? 0);
if ($submission_id <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid ID']);
    exit;
}

try {
    $stmt = $conn->prepare("
        SELECT m.materialFile
        FROM material_submission ms
        INNER JOIN material m ON ms.material_id = m.material_id
        WHERE ms.materialSubmission_id = :id
          AND ms.deanApprovalStatus = 'APPROVED'
    ");
    $stmt->bindParam(':id', $submission_id, PDO::PARAM_INT);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row || empty($row['materialFile'])) {
        echo json_encode(['error' => 'File not found']);
        exit;
    }

    $filename = basename($row['materialFile']);
    echo json_encode(['file' => $filename]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error']);
}
?>