<?php
// pages/submitMaterial.php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

require_once __DIR__ . '/../db.php';
$userId = $_SESSION['user_id'];

$materialTypeId = $_POST['materialType'] ?? '';
$materialName = $_POST['materialName'] ?? '';
$materialDescription = $_POST['materialDescription'] ?? '';
$authorLast = $_POST['authorLast'] ?? '';
$authorFirst = $_POST['authorFirst'] ?? '';
$authorMI = $_POST['authorMI'] ?? '';

// Validate required fields
if (empty($materialTypeId) || empty($materialName) || empty($authorLast) || empty($authorFirst)) {
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

if (!isset($_FILES['materialFile']) || $_FILES['materialFile']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['error' => 'No file uploaded or upload failed']);
    exit;
}

$uploadDir = __DIR__ . '/../uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$originalName = $_FILES['materialFile']['name'];
$ext = pathinfo($originalName, PATHINFO_EXTENSION);
$filename = uniqid('file_') . '.' . $ext;
$filepath = $uploadDir . $filename;

if (!move_uploaded_file($_FILES['materialFile']['tmp_name'], $filepath)) {
    echo json_encode(['error' => 'Failed to save file']);
    exit;
}

// Relative path to store in DB
$relativePath = 'uploads/' . $filename;

try {
    // Call your stored procedure with PATH (not BLOB)
    $stmt = $conn->prepare("CALL sp_submitMaterial(?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bindParam(1, $userId, PDO::PARAM_STR);
    $stmt->bindParam(2, $materialTypeId, PDO::PARAM_STR);
    $stmt->bindParam(3, $materialName, PDO::PARAM_STR);
    $stmt->bindParam(4, $materialDescription, PDO::PARAM_STR);
    $stmt->bindParam(5, $relativePath, PDO::PARAM_STR);  // PATH, not BLOB
    $stmt->bindParam(6, $authorLast, PDO::PARAM_STR);
    $stmt->bindParam(7, $authorFirst, PDO::PARAM_STR);
    $stmt->bindParam(8, $authorMI, PDO::PARAM_STR);
    $stmt->execute();

    echo json_encode(['success' => true, 'message' => 'Submitted successfully!']);

} catch (PDOException $e) {
    // Delete file if DB fails
    if (file_exists($filepath)) unlink($filepath);
    error_log("submitMaterial.php error: " . $e->getMessage());
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>