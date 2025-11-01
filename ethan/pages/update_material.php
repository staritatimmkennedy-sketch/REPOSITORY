<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../db.php';
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}
$id    = $input['id']    ?? 0;
$name  = $input['name']  ?? '';
$desc  = $input['desc']  ?? '';
$first = $input['first'] ?? null;
$mi    = $input['mi']    ?? null;
$last  = $input['last']  ?? null;
$call  = $input['call']  ?? '';
if (!$id || !$name || !$desc || !$call) {
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}
try {
    $stmt = $conn->prepare("CALL edit_published_material(?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$id, $name, $desc, $first, $mi, $last, $call]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $rowcount = $result['rowcount'] ?? 0;
    echo json_encode(['rowcount' => $rowcount]);
} catch (Exception $e) {
    error_log($e->getMessage());
    echo json_encode(['error' => 'Database error']);
}
?>