<?php
// pages/update_material_type.php
header('Content-Type: application/json');
require_once __DIR__ . '/../db.php'; 

try {
    $typeId = trim($_POST['materialType_id'] ?? '');
    $typeName = trim($_POST['materialTypeName'] ?? '');
    $description = trim($_POST['materialTypeDescription'] ?? '');

    if (empty($typeId)) throw new Exception('Invalid Material Type ID');
    if (empty($typeName)) throw new Exception('Material type name is required');
    if (!isset($conn) || !($conn instanceof PDO)) throw new Exception('Database connection unavailable');

    $stmt = $conn->prepare("
        UPDATE material_type 
        SET materialTypeName = ?, materialTypeDescription = ? 
        WHERE materialType_id = ?
    ");
    
    $result = $stmt->execute([$typeName, $description ?: null, $typeId]);

    if ($result) {
        $updatedStmt = $conn->prepare("
            SELECT 
                materialType_id AS id, 
                materialTypeName AS name, 
                COALESCE(materialTypeDescription, '') AS `desc`
            FROM material_type 
            WHERE materialType_id = ?
        ");
        $updatedStmt->execute([$typeId]);
        $updatedType = $updatedStmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'message' => 'Material Type updated successfully!',
            'materialType' => $updatedType
        ]);
    } else {
        $errorInfo = $stmt->errorInfo();
        throw new Exception("Database error: " . ($errorInfo[2] ?? 'Unknown error'));
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>