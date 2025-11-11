<?php
// pages/add_college.php
header('Content-Type: application/json');

session_start();  // REQUIRED FOR $_SESSION['user_id']
require_once __DIR__ . '/../db.php';

if (!isset($conn) || !($conn instanceof PDO)) {
    echo json_encode(['success' => false, 'message' => 'Database connection unavailable']);
    exit;
}

$collegeName = trim($_POST['college_name'] ?? '');
if (empty($collegeName)) {
    echo json_encode(['success' => false, 'message' => 'College name is required']);
    exit;
}

try {
    // === CALL STORED PROCEDURE ===
    $stmt = $conn->prepare("CALL sp_addCollege(?)");
    $stmt->execute([$collegeName]);

    // === CONSUME ALL RESULT SETS ===
    $result = [];
    do {
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if (!empty($rows)) {
            $result = $rows[0]; // First row from SP
        }
    } while ($stmt->nextRowset());

    // === CHECK SUCCESS ===
    if (isset($result['rowcount']) && $result['rowcount'] == 0) {
        echo json_encode([
            'success' => false,
            'message' => $result['message'] ?? 'College already exists'
        ]);
        exit;
    }

    // === AUDIT LOG: COLLEGE CREATED ===
    $currentUserId = $_SESSION['user_id'] ?? 'unknown';
    $collegeId = $result['college_id'] ?? 'unknown';
    $description = "Created new college ID '$collegeId': '$collegeName'";

    $logStmt = $conn->prepare("
        INSERT INTO audit_log (user_id, action_type, description) 
        VALUES (?, 'create', ?)
    ");
    $logStmt->execute([$currentUserId, $description]);

    // === SUCCESS RESPONSE ===
    echo json_encode([
        'success' => true,
        'college' => [
            'id' => $collegeId,
            'name' => $result['collegeName'] ?? $collegeName
        ]
    ]);

} catch (PDOException $e) {
    error_log("Add college error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Failed to add college. Please try again.']);
}
?>