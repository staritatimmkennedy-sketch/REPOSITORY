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

if (!$input || !isset($input['materialTypeId'])) {
    echo json_encode(['success' => false, 'error' => 'Missing material type ID']);
    exit;
}

try {
    $stmt = $conn->prepare("CALL sp_deleteMaterialType(:id)");
    $stmt->bindValue(':id', $input['materialTypeId'], PDO::PARAM_STR);
    $stmt->execute();
    
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $stmt->closeCursor();

    if ($result['rowcount'] > 0) {
        echo json_encode([
            'success' => true,
            'message' => $result['message'],
            'data' => $result
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => $result['message'] ?? 'Failed to delete material type'
        ]);
    }

} catch (Throwable $e) {
    echo json_encode([
        'success' => false,
        'error'   => 'Failed to delete material type: ' . $e->getMessage()
    ]);
}
?>