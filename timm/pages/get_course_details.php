<?php
// pages/get_course_details.php

header('Content-Type: application/json');
require_once __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$courseId = $_GET['course_id'] ?? null;

if (empty($courseId) || !is_numeric($courseId)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid Course ID']);
    exit;
}

try {
    if (!isset($conn) || !($conn instanceof PDO)) {
        throw new Exception('Database connection unavailable');
    }

    $stmt = $conn->prepare("
        SELECT 
            c.course_id AS id,
            c.courseName AS name,
            c.college_id,
            cl.collegeName AS college
        FROM course c
        LEFT JOIN college cl ON c.college_id = cl.college_id
        WHERE c.course_id = ?
    ");
    $stmt->execute([$courseId]);
    $course = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$course) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Course not found']);
        exit;
    }

    echo json_encode(['success' => true, 'course' => $course]);

} catch (Exception $e) {
    http_response_code(500);
    error_log("Error fetching course details: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>