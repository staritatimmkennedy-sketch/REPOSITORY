<?php
// pages/update_college.php
header('Content-Type: application/json');

session_start();  // REQUIRED FOR $_SESSION['user_id']
require_once __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$collegeId   = trim($_POST['college_id'] ?? '');
$collegeName = trim($_POST['college_name'] ?? '');

if (empty($collegeId) || !is_numeric($collegeId)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid College ID']);
    exit;
}

if (empty($collegeName)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'College name is required']);
    exit;
}

try {
    if (!isset($conn) || !($conn instanceof PDO)) {
        throw new Exception('Database connection unavailable');
    }

    // === FETCH OLD NAME FOR AUDIT LOG ===
    $oldStmt = $conn->prepare("SELECT collegeName FROM college WHERE college_id = ?");
    $oldStmt->execute([$collegeId]);
    $oldData = $oldStmt->fetch(PDO::FETCH_ASSOC);

    if (!$oldData) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'College not found.']);
        exit;
    }

    $oldName = $oldData['collegeName'];

    // === UPDATE COLLEGE ===
    $updateStmt = $conn->prepare("UPDATE college SET collegeName = ? WHERE college_id = ?");
    $updateStmt->execute([$collegeName, $collegeId]);

    // === CHECK IF ANYTHING CHANGED ===
    $wasUpdated = $updateStmt->rowCount() > 0;

    // === AUDIT LOG: ONLY IF NAME CHANGED ===
    if ($wasUpdated && $collegeName !== $oldName) {
        $currentUserId = $_SESSION['user_id'] ?? 'unknown';
        $description = "Updated college ID $collegeId: Name from '$oldName' to '$collegeName'";

        $logStmt = $conn->prepare("
            INSERT INTO audit_log (user_id, action_type, description) 
            VALUES (?, 'update', ?)
        ");
        $logStmt->execute([$currentUserId, $description]);
    }

    // === RETURN UPDATED DATA ===
    $updatedStmt = $conn->prepare("
        SELECT college_id AS id, collegeName AS name 
        FROM college 
        WHERE college_id = ?
    ");
    $updatedStmt->execute([$collegeId]);
    $updatedCollege = $updatedStmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'message' => 'College updated successfully!',
        'college' => $updatedCollege
    ]);

} catch (Exception $e) {
    error_log("Error updating college: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>