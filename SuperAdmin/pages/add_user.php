<?php
// pages/add_user.php

header('Content-Type: application/json');
require_once __DIR__ . '/../db.php';

// Use $conn (as defined in your db.php)
if (!isset($conn) || !($conn instanceof PDO)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection unavailable']);
    exit;
}

$firstName = $_POST['first_name'] ?? null;
$lastName = $_POST['last_name'] ?? null;
$middleName = $_POST['middle_name'] ?? null;
$username = $_POST['username'] ?? null;
$password = $_POST['password'] ?? '12345';
$roleId = $_POST['role'] ?? null;
$courseId = $_POST['course'] ?? null;
$yearLevel = $_POST['year_level'] ?? null;

// Validate required fields
if (!$firstName || !$lastName || !$username || !$roleId || !$courseId || !$yearLevel) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

try {
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->beginTransaction();

    // Call stored procedure
    $stmt = $conn->prepare("CALL sp_addUser(?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $firstName,
        $lastName,
        $middleName,
        (int)$roleId,
        $username,
        $password,
        (int)$yearLevel,
        (int)$courseId
    ]);
    do {
        $stmt->fetchAll();
    } while ($stmt->nextRowset());

    $conn->commit();

    echo json_encode(['success' => true, 'message' => 'User added successfully!']);

} catch (PDOException $e) {
    // Handle rollback safely if transaction is active
    if ($conn->inTransaction()) {
        try {
            // Clear any pending result sets before rollback
            do {
                $stmt?->fetchAll();
            } while ($stmt && $stmt->nextRowset());
            $conn->rollBack();
        } catch (Exception $rollbackErr) {
            error_log("Rollback failed: " . $rollbackErr->getMessage());
        }
    }
    error_log("Add user error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Failed to add user. Please try again.']);
} catch (Exception $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    error_log("Unexpected error in add_user.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An unexpected error occurred.']);
}
?>