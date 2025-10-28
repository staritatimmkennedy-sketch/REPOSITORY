<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

require_once __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$name = trim($_POST['materialTypeName'] ?? '');
$description = trim($_POST['materialTypeDescription'] ?? '');

if (empty($name)) {
    echo json_encode(['success' => false, 'message' => 'Material type name is required']);
    exit;
}

try {
    $stmt = $conn->query("SELECT materialType_id FROM material_type ORDER BY materialType_id DESC LIMIT 1");
    $lastId = $stmt->fetchColumn();

    if ($lastId && preg_match('/^MT(\d+)$/', $lastId, $matches)) {
        $number = intval($matches[1]) + 1;
        $newId = 'MT' . str_pad($number, 3, '0', STR_PAD_LEFT);
    } else {
        $newId = 'MT001';
    }
    $stmt = $conn->prepare("
        INSERT INTO material_type (materialType_id, materialTypeName, materialTypeDescription) 
        VALUES (?, ?, ?)
    ");
    $result = $stmt->execute([$newId, $name, $description ?: null]);
    if ($result) {
        echo json_encode([
            'success' => true,
            'materialType' => [
                'id' => $newId,
                'name' => $name,
                'desc' => $description
            ]
        ]);
    } else {
        $err = $stmt->errorInfo();
        error_log("Insert failed: " . print_r($err, true));
        echo json_encode(['success' => false, 'message' => 'Database insert failed: ' . $err[2]]);
    }
} catch (PDOException $e) {
    error_log("Exception: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}