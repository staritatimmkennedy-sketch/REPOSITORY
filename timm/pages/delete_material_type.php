<?php
// pages/delete_material_type.php
header('Content-Type: application/json');
require_once __DIR__ . '/../db.php'; 

try {
    $typeId = trim($_POST['materialType_id'] ?? '');

    if (empty($typeId)) throw new Exception('Invalid Material Type ID');
    if (!isset($conn) || !($conn instanceof PDO)) throw new Exception('Database connection unavailable');

    $conn->beginTransaction();

    // CRITICAL SAFETY CHECK: Prevent deletion if materials are linked
    $checkMaterialStmt = $conn->prepare("SELECT COUNT(*) FROM material WHERE materialType_id = ?");
    $checkMaterialStmt->execute([$typeId]);
    $materialCount = $checkMaterialStmt->fetchColumn();

    if ($materialCount > 0) {
        $conn->rollBack();
        throw new Exception("Cannot delete type. $materialCount material(s) are currently linked. Please reassign them first.");
    }
    
    // Delete the material type
    $deleteStmt = $conn->prepare("DELETE FROM material_type WHERE materialType_id = ?");
    $deleteStmt->execute([$typeId]);

    if ($deleteStmt->rowCount() === 0) {
        $conn->rollBack();
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Material Type not found or already deleted.']);
        exit;
    }

    $conn->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Material Type deleted successfully!',
        'materialType_id' => $typeId 
    ]);

} catch (Exception $e) {
    $conn->rollBack();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>