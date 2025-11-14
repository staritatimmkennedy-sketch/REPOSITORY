<?php
// pages/delete_course.php
header('Content-Type: application/json');
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method', 'rows_affected' => 0]);
    exit;
}

$course_id = $_POST['course_id'] ?? null;

if (!$course_id || !is_numeric($course_id)) {
    echo json_encode(['success' => false, 'message' => 'Course ID is required and must be numeric', 'rows_affected' => 0]);
    exit;
}

require_once __DIR__ . '/../db.php';

if (!isset($conn) || !($conn instanceof PDO)) {
    echo json_encode(['success' => false, 'message' => 'Database connection unavailable', 'rows_affected' => 0]);
    exit;
}

try {
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Fetch course details for logging
    $stmt = $conn->prepare("
        SELECT c.courseName, cl.collegeName 
        FROM course c 
        LEFT JOIN college cl ON c.college_id = cl.college_id 
        WHERE c.course_id = ?
    ");
    $stmt->execute([$course_id]);
    $course = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$course) {
        echo json_encode(['success' => false, 'message' => 'Course not found', 'rows_affected' => 0]);
        exit;
    }
    
    $courseName = $course['courseName'];
    $collegeName = $course['collegeName'];

    // Call the stored procedure
    $stmt = $conn->prepare("CALL sp_deleteCourse(?)");
    $stmt->execute([$course_id]);

    // Get the result from stored procedure
    $result = null;
    if ($stmt->columnCount() > 0) {
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    // Clear any remaining result sets
    while ($stmt->nextRowset()) {
        // Just consuming all result sets
    }

    $rows_affected = $result['rows_affected'] ?? 0;
    $message = $result['message'] ?? 'Course deleted successfully';
    
    // Determine success - if rows_affected > 0 OR if message indicates success
    $success = ($rows_affected > 0) || (stripos($message, 'success') !== false) || (stripos($message, 'deleted') !== false);

    // Audit logging if successful
    if ($success) {
        $current_user_id = $_SESSION['user_id'] ?? 'system';
        $description = "Deleted course ID: $course_id, Name: '$courseName' from '$collegeName'";

        $log_stmt = $conn->prepare("INSERT INTO audit_log (user_id, action_type, description) VALUES (?, 'delete', ?)");
        $log_stmt->execute([$current_user_id, $description]);
    }

    echo json_encode([
        'success' => $success,
        'message' => $message,
        'rows_affected' => $rows_affected
    ]);

} catch (PDOException $e) {
    error_log("Delete course error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage(),
        'rows_affected' => 0
    ]);
}
?>