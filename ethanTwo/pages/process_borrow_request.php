<?php
// /pages/process_borrow_request.php
if (session_status() === PHP_SESSION_NONE) { session_start(); }
header('Content-Type: application/json');

if (empty($_SESSION['user_id'])) {
  echo json_encode(['success' => false, 'error' => 'Not authenticated']); exit;
}

$borrowing_id      = $_POST['borrowing_id']      ?? null;
$action            = $_POST['action']            ?? '';
$librarian_remarks = $_POST['librarian_remarks'] ?? '';
$due_date          = $_POST['due_date']          ?? null;

if (!$borrowing_id || !$action) {
  echo json_encode(['success' => false, 'error' => 'Missing required fields']); exit;
}

require __DIR__ . '/../db.php';

try {
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  
  // First update due date if provided
  if ($due_date) {
    $updateStmt = $conn->prepare("UPDATE material_borrowing SET dueDate = :due_date WHERE materialBorrowing_id = :id");
    $updateStmt->bindValue(':due_date', $due_date, PDO::PARAM_STR);
    $updateStmt->bindValue(':id', (int)$borrowing_id, PDO::PARAM_INT);
    $updateStmt->execute();
  }
  
  // Then call the stored procedure with original 4 parameters
  $stmt = $conn->prepare("CALL sp_processBorrowRequest(:id, :lib, :st, :rmk)");
  $stmt->bindValue(':id',  (int)$borrowing_id, PDO::PARAM_INT);
  $stmt->bindValue(':lib', $_SESSION['user_id'], PDO::PARAM_STR);
  $stmt->bindValue(':st',  $action, PDO::PARAM_STR);
  $stmt->bindValue(':rmk', $librarian_remarks, PDO::PARAM_STR);
  $stmt->execute();

  $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
  $stmt->closeCursor();

  $ok = false;
  if ($rows && isset($rows[0]['rowcount'])) {
    $ok = (int)$rows[0]['rowcount'] === 1;
  } else {
    $ok = true;
  }

  echo json_encode(['success' => $ok, 'data' => $rows ?: []]);

} catch (Throwable $e) {
  echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>