<?php
session_start();
require __DIR__ . '/../db.php';

header('Content-Type: application/json');

try {
    $stmt = $conn->prepare("CALL sp_getAllPublishedMaterials()");
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $stmt->closeCursor(); 

    echo json_encode([
        'success' => true,
        'data'    => $rows ?: []
    ]);

} catch (Throwable $e) {
    echo json_encode([
        'success' => false,
        'error'   => 'Failed to load published materials: ' . $e->getMessage()
    ]);
}
?>