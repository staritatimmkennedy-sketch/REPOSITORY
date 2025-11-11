<?php
// pages/update_course.php
header('Content-Type: application/json');

session_start();  // REQUIRED FOR $_SESSION['user_id']
require_once __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$courseId   = trim($_POST['course_id'] ?? '');
$courseName = trim($_POST['course_name'] ?? '');
$collegeId  = trim($_POST['college_id'] ?? '');

if (empty($courseId) || !is_numeric($courseId)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid Course ID']);
    exit;
}

if (empty($courseName)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Course name is required']);
    exit;
}

if (empty($collegeId)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'College selection is required']);
    exit;
}

try {
    if (!isset($conn) || !($conn instanceof PDO)) {
        throw new Exception('Database connection unavailable');
    }

    // === FETCH OLD COURSE DATA FOR AUDIT ===
    $oldStmt = $conn->prepare("
        SELECT c.courseName, cl.collegeName 
        FROM course c 
        LEFT JOIN college cl ON c.college_id = cl.college_id 
        WHERE c.course_id = ?
    ");
    $oldStmt->execute([$courseId]);
    $oldData = $oldStmt->fetch(PDO::FETCH_ASSOC);

    if (!$oldData) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Course not found.']);
        exit;
    }

    $oldName     = $oldData['courseName'];
    $oldCollege  = $oldData['collegeName'];

    // === UPDATE COURSE ===
    $updateStmt = $conn->prepare("
        UPDATE course 
        SET courseName = ?, college_id = ? 
        WHERE course_id = ?
    ");
    $updateStmt->execute([$courseName, $collegeId, $courseId]);

    $wasUpdated = $updateStmt->rowCount() > 0;

    // === BUILD AUDIT LOG DESCRIPTION ===
    $changes = [];

    if ($courseName !== $oldName) {
        $changes[] = "Name: '$oldName' to '$courseName'";
    }

    // Fetch new college name
    $newCollegeStmt = $conn->prepare("SELECT collegeName FROM college WHERE college_id = ?");
    $newCollegeStmt->execute([$collegeId]);
    $newCollege = $newCollegeStmt->fetchColumn();

    if ($newCollege !== $oldCollege) {
        $changes[] = "College: '$oldCollege' to '$newCollege'";
    }

    // === AUDIT LOG: ONLY IF CHANGES MADE ===
    if (!empty($changes)) {
        $currentUserId = $_SESSION['user_id'] ?? 'unknown';
        $description = "Updated course ID $courseId: " . implode('; ', $changes);

        $logStmt = $conn->prepare("
            INSERT INTO audit_log (user_id, action_type, description) 
            VALUES (?, 'update', ?)
        ");
        $logStmt->execute([$currentUserId, $description]);
    }

    // === RETURN UPDATED DATA ===
    $updatedStmt = $conn->prepare("
        SELECT
            c.course_id AS id,
            c.courseName AS name,
            cl.collegeName AS college
        FROM course c
        LEFT JOIN college cl ON c.college_id = cl.college_id
        WHERE c.course_id = ?
    ");
    $updatedStmt->execute([$courseId]);
    $updatedCourse = $updatedStmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'message' => 'Course updated successfully!',
        'course' => $updatedCourse
    ]);

} catch (Exception $e) {
    error_log("Error updating course: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>