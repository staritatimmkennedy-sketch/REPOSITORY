<?php
require_once __DIR__ . "/../db.php";
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
if (!isset($_SESSION['user_id'])) {
    header("Location: ../login.php");
    exit;
}
$userId = $_SESSION['user_id'];

$stmt = $conn->prepare("SELECT role_id FROM user WHERE user_id = ?");
$stmt->execute([$userId]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$user || $user['role_id'] != 1) {
    die("Access denied: Admin only.");
}

$totalUsers = $conn->query("SELECT COUNT(*) AS total FROM user")->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;
$totalRoles = $conn->query("SELECT COUNT(*) AS total FROM role")->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;
$totalColleges = $conn->query("SELECT COUNT(*) AS total FROM college")->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;
$totalCourses = $conn->query("SELECT COUNT(*) AS total FROM course")->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;
$stats = [
    "users"    => (int)$totalUsers,
    "roles"    => (int)$totalRoles,
    "colleges" => (int)$totalColleges,
    "courses"  => (int)$totalCourses
];

$usersByCollege = [];
$stmt = $conn->query("
    SELECT
        c.collegeName AS name,
        COALESCE(COUNT(u.user_id), 0) AS user_count
    FROM college c
    LEFT JOIN course cr ON cr.college_id = c.college_id
    LEFT JOIN user_course uc ON uc.course_id = cr.course_id
    LEFT JOIN user u ON u.userCourse_id = uc.userCourse_id
    GROUP BY c.college_id, c.collegeName
    ORDER BY user_count DESC
");
$usersByCollege = $stmt ? $stmt->fetchAll(PDO::FETCH_ASSOC) : [];
$recentActions = [];
$stmt = $conn->query("
    SELECT
        m.materialName AS title,
        ms.deanApprovalStatus AS status,
        ms.deanApprovalDate AS date,
        col.collegeName AS college
    FROM material_submission ms
    JOIN material m ON m.material_id = ms.material_id
    JOIN user u ON ms.user_id = u.user_id
    JOIN user_course uc ON u.userCourse_id = uc.userCourse_id
    JOIN course crs ON uc.course_id = crs.course_id
    JOIN college col ON crs.college_id = col.college_id
    WHERE ms.deanApprovalStatus IN ('APPROVED','DENIED','REJECTED')
    ORDER BY ms.deanApprovalDate DESC
    LIMIT 5
");

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $diff = !empty($row['date']) ? time() - strtotime($row['date']) : 0;
    $timeAgo = $diff < 60 ? "Just now" :
               ($diff < 3600 ? floor($diff/60) . " min ago" :
               ($diff < 86400 ? floor($diff/3600) . " hrs ago" :
                                floor($diff/86400) . " days ago"));

    $dbStatus = strtoupper(trim($row['status'] ?? ''));
    $statusDisplay = 'Pending';
    $badgeClass = 'bg-yellow-100 text-yellow-800';
    if ($dbStatus === 'APPROVED') {
        $statusDisplay = 'Approved';
        $badgeClass = 'bg-green-100 text-green-800';
    } elseif (in_array($dbStatus, ['DENIED', 'REJECTED'])) {
        $statusDisplay = 'Rejected';
        $badgeClass = 'bg-red-100 text-red-800';
    }

    $recentActions[] = [
        "title" => $row['title'] ?? 'Untitled',
        "status" => $statusDisplay,
        "time" => $timeAgo,
        "badgeClass" => $badgeClass,
        "college" => $row['college'] ?? 'Unknown College'
    ];
}

$collegeColors = [
    'College of Engineering, Architecture & Technology' => 'bg-orange-500',
    'College of Health & Sciences' => 'bg-blue-400',
    'College of Education & Sciences' => 'bg-green-400',
    'College of Arts & Science' => 'bg-purple-400',
    'Business College' => 'bg-red-400',
];

include 'adminDashboard.html';