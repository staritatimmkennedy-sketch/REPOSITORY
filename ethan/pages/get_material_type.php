<?php
// pages/get_material_type.php
header('Content-Type: application/json');
require_once __DIR__ . '/../db.php'; 

$typeId = $_GET['id'] ?? null;
if (empty($typeId)) { http_response_code(400); echo json_encode(['success' => false, 'message' => 'Material Type ID is required']); exit; }

try {
    if (!isset($conn) || !($conn instanceof PDO)) throw new Exception('Database connection unavailable');

    $stmt = $conn->prepare("
        SELECT 
            materialType_id AS id, 
            materialTypeName AS name, 
            COALESCE(materialTypeDescription, '') AS `desc`
        FROM material_type 
        WHERE materialType_id = ?
    ");
    $stmt->execute([$typeId]);
    $type = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$type) { http_response_code(404); echo json_encode(['success' => false, 'message' => 'Material Type not found']); exit; }

    echo json_encode(['success' => true, 'materialType' => $type]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>