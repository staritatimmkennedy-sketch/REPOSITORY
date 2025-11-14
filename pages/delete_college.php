<?php
// pages/delete_college.php
header('Content-Type: application/json');

session_start();  // REQUIRED FOR $_SESSION['user_id']
require_once __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$collegeId = trim($_POST['college_id'] ?? '');
if (empty($collegeId) || !is_numeric($collegeId)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid College ID']);
    exit;
}

try {
    if (!isset($conn) || !($conn instanceof PDO)) {
        throw new Exception('Database connection unavailable');
    }

    // === FETCH COLLEGE NAME BEFORE DELETE (for audit log) ===
    $nameStmt = $conn->prepare("SELECT collegeName FROM college WHERE college_id = ?");
    $nameStmt->execute([$collegeId]);
    $collegeData = $nameStmt->fetch(PDO::FETCH_ASSOC);

    if (!$collegeData) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'College not found.']);
        exit;
    }

    $collegeName = $collegeData['collegeName'];

    // === DEPENDENCY CHECK: Prevent delete if courses exist ===
    $checkCourseStmt = $conn->prepare("SELECT COUNT(*) FROM course WHERE college_id = ?");
    $checkCourseStmt->execute([$collegeId]);
    $courseCount = $checkCourseStmt->fetchColumn();

    if ($courseCount > 0) {
        $message = "Cannot delete college. $courseCount course(s) are currently assigned. Please reassign them first.";
        echo json_encode(['success' => false, 'message' => $message]);
        exit;
    }

    // === START TRANSACTION ===
    $conn->beginTransaction();

    // === DELETE COLLEGE ===
    $deleteStmt = $conn->prepare("DELETE FROM college WHERE college_id = ?");
    $deleteStmt->execute([$collegeId]);

    if ($deleteStmt->rowCount() === 0) {
        $conn->rollBack();
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'College not found or already deleted.']);
        exit;
    }

    // === AUDIT LOG: COLLEGE DELETED ===
    $currentUserId = $_SESSION['user_id'] ?? 'unknown';
    $description = "Deleted college ID $collegeId: '$collegeName' (no courses assigned)";

    $logStmt = $conn->prepare("
        INSERT INTO audit_log (user_id, action_type, description) 
        VALUES (?, 'delete', ?)
    ");
    $logStmt->execute([$currentUserId, $description]);

    $conn->commit();

    echo json_encode([
        'success' => true,
        'message' => 'College deleted successfully!',
        'college_id' => $collegeId
    ]);

} catch (Exception $e) {
    if ($conn && $conn->inTransaction()) {
        $conn->rollBack();
    }
    error_log("Error deleting college: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>