<?php
// pages/update_course.php

header('Content-Type: application/json');
require_once __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$courseId = trim($_POST['course_id'] ?? '');
$courseName = trim($_POST['course_name'] ?? '');
$collegeId = trim($_POST['college_id'] ?? '');

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

    // Update course details
    $updateStmt = $conn->prepare("UPDATE course SET courseName = ?, college_id = ? WHERE course_id = ?");
    $updateStmt->execute([$courseName, $collegeId, $courseId]);
    
    if ($updateStmt->rowCount() > 0 || $updateStmt->errorCode() === '00000') {
        // Fetch the updated course details
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
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Course not found or no changes made.']);
    }

} catch (Exception $e) {
    http_response_code(500);
    error_log("Error updating course: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>