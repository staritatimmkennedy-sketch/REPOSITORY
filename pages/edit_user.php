<?php
// pages/edit_user.php
header('Content-Type: application/json');
session_start();
require_once __DIR__ . '/../db.php';

if (!isset($conn) || !($conn instanceof PDO)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection unavailable']);
    exit;
}

// === Get POST data ===
$userId      = $_POST['user_id'] ?? null;
$firstName   = $_POST['first_name'] ?? null;
$lastName    = $_POST['last_name'] ?? null;
$middleName  = $_POST['middle_name'] ?? null;
$newPassword = $_POST['password'] ?? null;
$roleId      = $_POST['role'] ?? null;
$courseId    = $_POST['course'] ?? null;
$yearLevel   = $_POST['year_level'] ?? null;

// === Validate required fields ===
if (!$userId || !$firstName || !$lastName || !$roleId || !$courseId || !$yearLevel) {
    echo json_encode(['success' => false, 'message' => 'Required fields are missing.']);
    exit;
}

// === Fetch OLD data for audit log ===
$oldData = [];
try {
    $stmt = $conn->prepare("
        SELECT firstName, lastName, middleName, role_id, userCourse_id, yearLevel 
        FROM user 
        WHERE user_id = ?
    ");
    $stmt->execute([$userId]);
    $oldData = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$oldData) {
        echo json_encode(['success' => false, 'message' => 'User not found.']);
        exit;
    }
} catch (Exception $e) {
    error_log("Fetch old user data error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Failed to fetch user data.']);
    exit;
}

// === Build UPDATE query ===
try {
    $sql = "UPDATE user SET 
            firstName=?, lastName=?, middleName=?, role_id=?, userCourse_id=?, yearLevel=?";
    $params = [$firstName, $lastName, $middleName, (int)$roleId, (int)$courseId, (int)$yearLevel];

    $passwordChanged = false;
    if (!empty($newPassword)) {
        $sql .= ", password=MD5(?)";
        $params[] = $newPassword;
        $passwordChanged = true;
    }

    $sql .= " WHERE user_id=?";
    $params[] = $userId;

    $stmt = $conn->prepare($sql);
    $stmt->execute($params);

    // === AUDIT LOGGING (NO IP ADDRESS) ===
    $changes = [];
    if ($firstName !== $oldData['firstName']) $changes[] = "First Name: '{$oldData['firstName']}' to '$firstName'";
    if ($lastName !== $oldData['lastName']) $changes[] = "Last Name: '{$oldData['lastName']}' to '$lastName'";
    if ($middleName !== $oldData['middleName']) $changes[] = "Middle Name: '{$oldData['middleName']}' to '$middleName'";
    if ((int)$roleId !== (int)$oldData['role_id']) $changes[] = "Role ID: {$oldData['role_id']} to $roleId";
    if ((int)$courseId !== (int)$oldData['userCourse_id']) $changes[] = "Course ID: {$oldData['userCourse_id']} to $courseId";
    if ((int)$yearLevel !== (int)$oldData['yearLevel']) $changes[] = "Year Level: {$oldData['yearLevel']} to $yearLevel";
    if ($passwordChanged) $changes[] = "Password updated";

    if (!empty($changes) || $stmt->rowCount() > 0) {
        $description = "Updated user ID $userId: " . implode('; ', $changes);
        
        $logStmt = $conn->prepare("
            INSERT INTO audit_log (user_id, action_type, description) 
            VALUES (?, 'update', ?)
        ");
        $currentUserId = $_SESSION['user_id'] ?? 'unknown';
        $logStmt->execute([$currentUserId, $description]);
    }

    // === Response ===
    if ($stmt->rowCount() > 0 || !empty($changes)) {
        echo json_encode(['success' => true, 'message' => 'User updated and logged.']);
    } else {
        echo json_encode(['success' => true, 'message' => 'No changes detected.']);
    }

} catch (PDOException $e) {
    error_log("Edit user error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error.']);
}
?>