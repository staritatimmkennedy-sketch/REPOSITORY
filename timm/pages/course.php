<?php
// pages/course.php
require_once __DIR__ . '/../db.php';

// Initialize fallback data
$dummyCourses = [
    ["id" => "1", "college" => "College of Engineering, Architecture and Technology", "name" => "BSCS – Bachelor of Science in Computer Science"],
    ["id" => "2", "college" => "College of Health Sciences", "name" => "BSN - Bachelor of Science in Nursing"],
    ["id" => "3", "college" => "College of Arts and Science", "name" => "BSBIO - Bachelor of Science in Biology"],
    ["id" => "4", "college" => "Business College", "name" => "BSA – Bachelor of Science in Accounting"],
    ["id" => "5", "college" => "College of Education", "name" => "BPED - Bachelor of Physical Education"]
];

$dummyColleges = [
    ["id" => "1", "name" => "College of Engineering, Architecture and Technology"],
    ["id" => "2", "name" => "College of Health Sciences"],
    ["id" => "3", "name" => "College of Arts and Science"],
    ["id" => "4", "name" => "Business College"],
    ["id" => "5", "name" => "College of Education"]
];

if (!isset($conn) || !($conn instanceof PDO)) {
    // DB connection failed → use dummy data
    $courses = $dummyCourses;
    $collegesForFilter = array_column($dummyCourses, 'college');
    $collegesForModal = $dummyColleges;
} else {
    try {
        // Fetch all courses with college names
        $stmt = $conn->query("
            SELECT 
                c.course_id AS id,
                c.courseName AS name,
                COALESCE(cl.collegeName, '—') AS college
            FROM course c
            LEFT JOIN college cl ON c.college_id = cl.college_id
            ORDER BY c.course_id ASC
        ");
        $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Fetch all colleges for MODAL (even if no courses use them yet)
        $modalStmt = $conn->query("
            SELECT college_id AS id, collegeName AS name
            FROM college
            ORDER BY collegeName
        ");
        $collegesForModal = $modalStmt->fetchAll(PDO::FETCH_ASSOC);

        // Fetch colleges that have at least one course for FILTER dropdown
        $filterStmt = $conn->query("
            SELECT DISTINCT cl.collegeName 
            FROM college cl
            INNER JOIN course c ON c.college_id = cl.college_id
            ORDER BY cl.collegeName
        ");
        $collegesForFilter = $filterStmt->fetchAll(PDO::FETCH_COLUMN);

        // If no courses exist, use dummy data but keep real colleges if available
        if (empty($courses)) {
            $courses = $dummyCourses;
            // Use real colleges for modal if available, otherwise dummy
            if (empty($collegesForModal)) {
                $collegesForModal = $dummyColleges;
            }
            $collegesForFilter = array_unique(array_column($courses, 'college'));
        }

    } catch (PDOException $e) {
        error_log("Course fetch error: " . $e->getMessage());
        // On query error, fall back to dummy data
        $courses = $dummyCourses;
        $collegesForFilter = array_column($dummyCourses, 'college');
        $collegesForModal = $dummyColleges;
    }
}

include 'course.html';
?>