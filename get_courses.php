<?php
// get_courses.php - Fixed version
header('Content-Type: application/json');

require 'db.php';

try {
    $collegeId = isset($_GET['college_id']) ? (int)$_GET['college_id'] : 0;
    
    if ($collegeId <= 0) {
        echo json_encode([]);
        exit;
    }
    
    // Correct table name is 'course' (singular)
    $sql = "SELECT course_id, courseName 
            FROM course 
            WHERE college_id = ? 
            ORDER BY courseName";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute([$collegeId]);
    $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($courses);
    
} catch (Exception $e) {
    error_log("get_courses.php error: " . $e->getMessage());
    echo json_encode([]);
}