<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id'])) {
    echo "Error: No user logged in.";
    exit;
}

require __DIR__ . '/../db.php'; 

$userId              = $_SESSION['user_id'];
$materialTypeId      = $_POST['materialType'];
$materialName        = $_POST['materialName'];
$materialDescription = $_POST['materialDescription'];
$authorLast          = $_POST['authorLast'];
$authorFirst         = $_POST['authorFirst'];
$authorMI            = $_POST['authorMI'];

if (!isset($_FILES['materialFile']) || $_FILES['materialFile']['error'] !== UPLOAD_ERR_OK) {
    echo "Error: No file uploaded or file upload failed.";
    exit;
}

$fileData = file_get_contents($_FILES['materialFile']['tmp_name']);

try {
    $stmt = $conn->prepare("CALL sp_submitMaterial(?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bindParam(1, $userId);
    $stmt->bindParam(2, $materialTypeId);
    $stmt->bindParam(3, $materialName);
    $stmt->bindParam(4, $materialDescription);
    $stmt->bindParam(5, $fileData, PDO::PARAM_LOB);
    $stmt->bindParam(6, $authorLast);
    $stmt->bindParam(7, $authorFirst);
    $stmt->bindParam(8, $authorMI);
    $stmt->execute();

    echo "success";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
