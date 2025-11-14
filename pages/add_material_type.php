<?php
session_start();
require __DIR__ . '/../db.php';

header('Content-Type: application/json');

// Require login
if (empty($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Not authenticated']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['materialTypeId']) || !isset($input['materialTypeName'])) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

try {
    $stmt = $conn->prepare("CALL sp_addMaterialType(:id, :name, :desc)");
    $stmt->bindValue(':id', $input['materialTypeId'], PDO::PARAM_STR);
    $stmt->bindValue(':name', $input['materialTypeName'], PDO::PARAM_STR);
    $stmt->bindValue(':desc', $input['materialTypeDescription'] ?? '', PDO::PARAM_STR);
    $stmt->execute();
    
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $stmt->closeCursor();

    if ($result['rowcount'] > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Material type added successfully',
            'data' => $result
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => $result['message'] ?? 'Failed to add material type'
        ]);
    }

} catch (Throwable $e) {
    echo json_encode([
        'success' => false,
        'error'   => 'Failed to add material type: ' . $e->getMessage()
    ]);
}
?>