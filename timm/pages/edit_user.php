<?php
// pages/edit_user.php

header('Content-Type: application/json');
require_once __DIR__ . '/../db.php';

if (!isset($conn) || !($conn instanceof PDO)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection unavailable']);
    exit;
}

$userId = $_POST['user_id'] ?? null;
$firstName = $_POST['first_name'] ?? null;
$lastName = $_POST['last_name'] ?? null;
$middleName = $_POST['middle_name'] ?? null;
$newPassword = $_POST['password'] ?? null; // Optional
$roleId = $_POST['role'] ?? null;
$courseId = $_POST['course'] ?? null;
$yearLevel = $_POST['year_level'] ?? null;

if (!$userId || !$firstName || !$lastName || !$roleId || !$courseId || !$yearLevel) {
    echo json_encode(['success' => false, 'message' => 'Required fields are missing.']);
    exit;
}

try {
    $sql = "UPDATE user SET firstName=?, lastName=?, middleName=?, role_id=?, userCourse_id=?, yearLevel=?";
    $params = [$firstName, $lastName, $middleName, (int)$roleId, (int)$courseId, (int)$yearLevel];

    // Password update logic using MD5() as found in sp_addUser
    if (!empty($newPassword)) {
        $sql .= ", password=MD5(?)";
        $params[] = $newPassword;
    }

    $sql .= " WHERE user_id=?";
    $params[] = $userId;

    $stmt = $conn->prepare($sql);
    $stmt->execute($params);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'User updated successfully!']);
    } else {
        echo json_encode(['success' => true, 'message' => 'User details saved (no changes detected or successful update).']);
    }

} catch (PDOException $e) {
    error_log("Edit user error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to update user.']);
}
?>