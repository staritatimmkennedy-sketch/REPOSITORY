<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../db.php';
$input = json_decode(file_get_contents('php://input'), true);
$id = $input['id'] ?? 0;
if (!$id || !is_numeric($id)) {
    echo json_encode(['error' => 'Invalid ID']);
    exit;
}

try {
    $stmt = $conn->prepare("CALL delete_published_material(?)");
    $stmt->execute([$id]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $rowcount = $result['rowcount'] ?? 0;
    echo json_encode(['rowcount' => (int)$rowcount]);
} catch (Exception $e) {
    error_log("Delete error: " . $e->getMessage());
    echo json_encode(['error' => 'Database error']);
}
?>