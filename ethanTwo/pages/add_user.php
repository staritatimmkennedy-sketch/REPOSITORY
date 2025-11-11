<?php
// pages/add_user.php
header('Content-Type: application/json');
session_start();  // REQUIRED FOR $_SESSION['user_id']
require_once __DIR__ . '/../db.php';

if (!isset($conn) || !($conn instanceof PDO)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection unavailable']);
    exit;
}

$firstName   = $_POST['first_name'] ?? null;
$lastName    = $_POST['last_name'] ?? null;
$middleName  = $_POST['middle_name'] ?? null;
$username    = $_POST['username'] ?? null;
$password    = $_POST['password'] ?? '12345';
$roleId      = $_POST['role'] ?? null;
$courseId    = $_POST['course'] ?? null;
$yearLevel   = $_POST['year_level'] ?? null;

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

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    // Clear remaining result sets
    do {
        $stmt->fetchAll();
    } while ($stmt->nextRowset());

    if ($result && isset($result['rowcount']) && $result['rowcount'] > 0) {
        // === GET NEW USER ID ===
        $stmt = $conn->prepare("SELECT user_id FROM user WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        $newUserId = $user['user_id'] ?? null;

        // === AUDIT LOG (CREATE) ===
        if ($newUserId) {
            $currentUserId = $_SESSION['user_id'] ?? 'unknown';
            $description = "Created new user ID $newUserId: $firstName $lastName (@$username), Role ID: $roleId";

            $logStmt = $conn->prepare("
                INSERT INTO audit_log (user_id, action_type, description) 
                VALUES (?, 'create', ?)
            ");
            $logStmt->execute([$currentUserId, $description]);
        }

        $conn->commit();

        echo json_encode([
            'success' => true,
            'message' => 'User added successfully!',
            'user_id' => $newUserId
        ]);
    } else {
        $conn->rollBack();
        $errorMessage = $result['message'] ?? 'Failed to add user. Username may already exist.';
        echo json_encode(['success' => false, 'message' => $errorMessage]);
    }

} catch (PDOException $e) {
    if ($conn->inTransaction()) {
        do { $stmt?->fetchAll(); } while ($stmt && $stmt->nextRowset());
        $conn->rollBack();
    }
    error_log("Add user error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Failed to add user. Please try again.']);
} catch (Exception $e) {
    if ($conn->inTransaction()) $conn->rollBack();
    error_log("Unexpected error in add_user.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An unexpected error occurred.']);
}
?>