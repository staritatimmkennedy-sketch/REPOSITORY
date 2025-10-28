<?php
require_once __DIR__ . '/../db.php';

if (!isset($conn) || !($conn instanceof PDO)) {
    die('Database connection unavailable.');
}
try {
    // Fetch users
    $userStmt = $conn->query("
    SELECT 
            u.user_id, u.firstName, u.middleName, u.lastName, u.yearLevel, u.username,
            r.roleName AS role, 
            c.courseName AS course
        FROM user u
        LEFT JOIN role r ON u.role_id = r.role_id
        LEFT JOIN course c ON u.userCourse_id = c.course_id
        ORDER BY u.firstName
    ");
    $users = $userStmt->fetchAll();

    // Fetch filters
    $roleFilterQuery = $conn->query("
        SELECT DISTINCT r.roleName 
        FROM role r 
        INNER JOIN user u ON u.role_id = r.role_id
        ORDER BY r.roleName
    ");
    $roles = $roleFilterQuery->fetchAll(PDO::FETCH_COLUMN);

    $courseFilterQuery = $conn->query("
        SELECT DISTINCT c.courseName 
        FROM course c 
        INNER JOIN user u ON u.userCourse_id = c.course_id
        ORDER BY c.courseName
    ");
    $courses = $courseFilterQuery->fetchAll(PDO::FETCH_COLUMN);

    $yearFilterQuery = $conn->query("
        SELECT DISTINCT yearLevel 
        FROM user 
        WHERE yearLevel IS NOT NULL 
        ORDER BY yearLevel ASC
    ");
    $years = $yearFilterQuery->fetchAll(PDO::FETCH_COLUMN);

} catch (PDOException $e) {
    die('Query error: ' . htmlspecialchars($e->getMessage()));
}

// Now include the view
include 'users.html';
?>