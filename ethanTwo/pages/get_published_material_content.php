<?php
require '../db.php';

if (!isset($_GET['material_id'])) {
    echo json_encode(['error' => 'Material ID is required']);
    exit;
}

$materialId = $_GET['material_id'];

try {
    // Join with material table to get the file path
    $sql = "SELECT m.materialFile 
            FROM material_publishing mp
            JOIN material_submission ms ON mp.materialSubmission_id = ms.materialSubmission_id
            JOIN material m ON ms.material_id = m.material_id
            WHERE mp.materialPublishing_id = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute([$materialId]);
    $material = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$material) {
        echo json_encode(['error' => 'Published material not found']);
        exit;
    }
    
    if (!$material['materialFile']) {
        echo json_encode(['error' => 'File not found for this material']);
        exit;
    }
    
    echo json_encode(['file' => $material['materialFile']]);
    
} catch (Exception $e) {
    error_log("Database error in get_published_material_content: " . $e->getMessage());
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>