<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
header('Content-Type: application/json');

if (empty($_SESSION['user_id'])) {
  echo json_encode(['success' => false, 'error' => 'Not authenticated']);
  exit;
}

require __DIR__ . '/../db.php'; // must set $conn = new PDO(...)

$userId = $_SESSION['user_id'];

try {
  // Make sure PDO is in exception mode
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  // (Optional but often necessary for CALL): enable emulation
  $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, true);

  // Exactly ONE placeholder, exactly ONE bind
  $stmt = $conn->prepare("CALL sp_getMyBorrowings(:uid)");
  $stmt->bindValue(':uid', $userId, PDO::PARAM_STR);
  $stmt->execute();

  // Fetch the first result set
  $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
  $stmt->closeCursor(); // important for CALLs

  // Drain any additional result sets (some MariaDB setups need this)
  while ($stmt->nextRowset()) { /* no-op */ }

  echo json_encode(['success' => true, 'data' => $rows ?: []], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
  echo json_encode([
    'success' => false,
    'error'   => $e->getMessage()
  ]);
}
