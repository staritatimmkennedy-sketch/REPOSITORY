<?php
// pages/edit_submission.php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

require_once __DIR__ . '/../db.php';
$userId = $_SESSION['user_id'];

// Get form data - match EXACT field names from JavaScript
$submissionId = $_POST['submission_id'] ?? '';
$materialName = $_POST['materialName'] ?? '';
$materialDescription = $_POST['materialDescription'] ?? '';
$authorLast = $_POST['author_lastname'] ?? '';        // Changed to author_lastname
$authorFirst = $_POST['author_firstname'] ?? '';      // Changed to author_firstname
$authorMI = $_POST['author_mi'] ?? '';                // Changed to author_mi
$materialTypeId = $_POST['materialType_id'] ?? '';    // Changed to materialType_id

// Debug: Log received data
error_log("Edit Submission - Received: submission_id=$submissionId, materialName=$materialName, materialType_id=$materialTypeId, author_lastname=$authorLast, author_firstname=$authorFirst");

// Validate required fields
if (empty($submissionId)) {
    echo json_encode(['error' => 'Missing submission ID']);
    exit;
}

if (empty($materialName) || empty($authorLast) || empty($authorFirst) || empty($materialTypeId)) {
    echo json_encode(['error' => 'Please fill in all required fields: Title, Author Last Name, Author First Name, and Material Type']);
    exit;
}

$relativePath = null;
$fileUploaded = false;

// Handle file upload if present - OPTIONAL
if (isset($_FILES['materialFile']) && $_FILES['materialFile']['error'] === UPLOAD_ERR_OK) {
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

    $relativePath = 'uploads/' . $filename;
    $fileUploaded = true;
}

try {
    // Call stored procedure
    $stmt = $conn->prepare("CALL sp_editSubmission(?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bindParam(1, $submissionId, PDO::PARAM_INT);
    $stmt->bindParam(2, $materialName, PDO::PARAM_STR);
    $stmt->bindParam(3, $materialTypeId, PDO::PARAM_STR);
    $stmt->bindParam(4, $materialDescription, PDO::PARAM_STR);
    $stmt->bindParam(5, $relativePath, PDO::PARAM_STR); // Can be NULL
    $stmt->bindParam(6, $authorLast, PDO::PARAM_STR);
    $stmt->bindParam(7, $authorFirst, PDO::PARAM_STR);
    $stmt->bindParam(8, $authorMI, PDO::PARAM_STR);
    
    $stmt->execute();

    echo json_encode(['success' => true, 'message' => 'Submission updated successfully!']);

} catch (PDOException $e) {
    // Delete file if DB fails
    if ($fileUploaded && $relativePath && file_exists(__DIR__ . '/../' . $relativePath)) {
        unlink(__DIR__ . '/../' . $relativePath);
    }
    error_log("edit_submission.php error: " . $e->getMessage());
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>