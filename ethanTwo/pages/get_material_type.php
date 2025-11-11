<?php
session_start();
require __DIR__ . '/../db.php';

header('Content-Type: application/json');

// Require login (consistent with your existing auth check)
if (empty($_SESSION['user_id'])) {
  echo json_encode(['success' => false, 'error' => 'Not authenticated']);
  exit;
}

try {
  // Call the stored procedure (no parameters needed for material types)
  $stmt = $conn->prepare("CALL sp_getMaterialTypes()");
  $stmt->execute();

  // Fetch rows (consistent with your existing fetch pattern)
  $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
  $stmt->closeCursor(); 

  echo json_encode([
    'success' => true,
    'data'    => $rows ?: []
  ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
  echo json_encode([
    'success' => false,
    'error'   => 'Failed to load material types',
    'detail'  => $e->getMessage()
  ]);
}