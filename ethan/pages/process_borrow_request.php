<?php
// /pages/process_borrow_request.php
if (session_status() === PHP_SESSION_NONE) { session_start(); }
header('Content-Type: application/json');

// Must be logged in (librarian_id is taken from session)
if (empty($_SESSION['user_id'])) {
  echo json_encode(['success' => false, 'error' => 'Not authenticated']); exit;
}

$borrowing_id      = $_POST['borrowing_id']      ?? null; // int
$action            = $_POST['action']            ?? '';   // REQUESTED|APPROVED|DENIED|BORROWED|RETURNED (use APPROVED/DENIED/RETURNED here)
$librarian_remarks = $_POST['librarian_remarks'] ?? '';

if (!$borrowing_id || !$action) {
  echo json_encode(['success' => false, 'error' => 'Missing required fields']); exit;
}

require __DIR__ . '/../db.php';

try {
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, true);

  $stmt = $conn->prepare("CALL sp_processBorrowRequest(:id, :lib, :st, :rmk)");
  $stmt->bindValue(':id',  (int)$borrowing_id, PDO::PARAM_INT);
  $stmt->bindValue(':lib', $_SESSION['user_id'], PDO::PARAM_STR);
  $stmt->bindValue(':st',  strtoupper($action), PDO::PARAM_STR);
  $stmt->bindValue(':rmk', $librarian_remarks, PDO::PARAM_STR);
  $stmt->execute();

  // SP returns a result row; treat presence as success
  $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
  $stmt->closeCursor();

  $ok = false;
  if ($rows && isset($rows[0]['rowcount'])) {
    $ok = (int)$rows[0]['rowcount'] === 1;
  } else {
    // if your SP doesn’t return rowcount consistently, fall back to "no error = ok"
    $ok = true;
  }

  echo json_encode(['success' => $ok, 'data' => $rows ?: []]);

} catch (Throwable $e) {
  echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
