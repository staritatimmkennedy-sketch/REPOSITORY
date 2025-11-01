<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../db.php';
$id = $_GET['id'] ?? 0;
if (!is_numeric($id)) {
    echo json_encode(['error' => 'Invalid ID']);
    exit;
}
try {
    $sql = "
        SELECT mp.materialPublishing_id, mp.callNumber,
               m.materialName, m.materialDescription,
               m.author_firstname, m.author_mi, m.author_lastname
        FROM material_publishing mp
        JOIN material_submission ms ON mp.materialSubmission_id = ms.materialSubmission_id
        JOIN material m ON ms.material_id = m.material_id
        WHERE mp.materialPublishing_id = ?
    ";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($row ?: ['error' => 'Not found']);
} catch (Exception $e) {
    echo json_encode(['error' => 'Server error']);
}
?>