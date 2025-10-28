<?php
session_start();
require __DIR__ . '/../db.php';

header('Content-Type: application/json');

// Require login
if (empty($_SESSION['user_id'])) {
  echo json_encode(['success' => false, 'error' => 'Not authenticated']);
  exit;
}

require __DIR__ . '/../db.php';   // must set $conn = new PDO(...)

$userId = $_SESSION['user_id'];

try {
  // Call the stored procedure
  $stmt = $conn->prepare("CALL sp_getPublishedMaterialsForUser(:uid)");
  $stmt->bindValue(':uid', $userId, PDO::PARAM_STR);
  $stmt->execute();

  // Fetch rows
  $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
  $stmt->closeCursor(); 

  echo json_encode([
    'success' => true,
    'data'    => $rows ?: []
  ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
  echo json_encode([
    'success' => false,
    'error'   => 'Failed to load published materials',
    'detail'  => $e->getMessage()
  ]);
}
