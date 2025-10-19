<?php
if (session_status() === PHP_SESSION_NONE) {
  session_start();
}

header('Content-Type: application/json');
require __DIR__ . '/../db.php';

// 1️⃣ Get logged-in dean ID
$deanId = $_SESSION['user_id'] ?? null;

if (!$deanId) {
  echo json_encode(["error" => "No dean logged in"]);
  exit;
}

try {
  $stmt = $conn->prepare("CALL sp_getDeanSubmissionsTwo(?)");
  $stmt->bindParam(1, $deanId, PDO::PARAM_STR);
  $stmt->execute();

  $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
  while ($stmt->nextRowset()) { /* consume remaining */ }
  $stmt->closeCursor();

  echo json_encode($results);
} catch (PDOException $e) {
  echo json_encode(["error" => $e->getMessage()]);
}
