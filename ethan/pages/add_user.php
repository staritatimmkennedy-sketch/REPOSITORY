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
    
    // Fetch the result from the stored procedure
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Clear any remaining result sets
    do {
        $stmt->fetchAll();
    } while ($stmt->nextRowset());

    $conn->commit();

    // Check if the stored procedure was successful
   // In the success section of add_user.php, replace with this:
if ($result && isset($result['rowcount']) && $result['rowcount'] > 0) {
    // The stored procedure was successful
    // Fetch the newly created user_id using the username
    $stmt = $conn->prepare("SELECT user_id FROM user WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user && isset($user['user_id'])) {
        echo json_encode([
            'success' => true, 
            'message' => 'User added successfully!',
            'user_id' => $user['user_id'] // Return the actual database user ID
        ]);
    } else {
        // Fallback: return success but indicate we need to refresh
        echo json_encode([
            'success' => true, 
            'message' => 'User added successfully! Please refresh to see changes.',
            'user_id' => null
        ]);
    }
} else {
    $errorMessage = $result['message'] ?? 'Failed to add user. Username may already exist.';
    echo json_encode(['success' => false, 'message' => $errorMessage]);
}

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