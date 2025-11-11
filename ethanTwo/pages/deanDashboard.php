<?php
require_once __DIR__ . "/../db.php";

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
if (!isset($_SESSION['user_id'])) {
    header("Location: ../login.php");
    exit;
}
$deanId = $_SESSION['user_id'];

/* ---------- 1. Verify dean-college link ---------- */
$stmt = $conn->prepare("SELECT collegeID FROM dean_college WHERE deanID = ?");
$stmt->execute([$deanId]);
$deanCollege = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$deanCollege) {
    die("Access denied: You are not assigned to any college.");
}
$collegeId = $deanCollege['collegeID'];

/* ---------- 2. STATS (per college) ---------- */
$totalPending = 0;
$stmt = $conn->prepare("
    SELECT COUNT(*) AS total
    FROM material_submission ms
    JOIN user u          ON ms.user_id = u.user_id
    JOIN user_course uc  ON u.userCourse_id = uc.userCourse_id
    JOIN course c        ON uc.course_id = c.course_id
    WHERE c.college_id = ? AND ms.deanApprovalStatus = 'PENDING'
");
$stmt->execute([$collegeId]);
$totalPending = $stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;

$totalApproved = 0;
$stmt = $conn->prepare("
    SELECT COUNT(*) AS total
    FROM material_submission ms
    JOIN user u          ON ms.user_id = u.user_id
    JOIN user_course uc  ON u.userCourse_id = uc.userCourse_id
    JOIN course c        ON uc.course_id = c.course_id
    WHERE c.college_id = ? AND ms.deanApprovalStatus = 'APPROVED'
");
$stmt->execute([$collegeId]);
$totalApproved = $stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;

$totalRejected = 0;
$stmt = $conn->prepare("
    SELECT COUNT(*) AS total
    FROM material_submission ms
    JOIN user u          ON ms.user_id = u.user_id
    JOIN user_course uc  ON u.userCourse_id = uc.userCourse_id
    JOIN course c        ON uc.course_id = c.course_id
    WHERE c.college_id = ? AND ms.deanApprovalStatus IN ('DENIED','REJECTED')
");
$stmt->execute([$collegeId]);
$totalRejected = $stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;

$totalSubmissions = $totalPending + $totalApproved + $totalRejected;

$stats = [
    "pending"   => (int)$totalPending,
    "approved"  => (int)$totalApproved,
    "rejected"  => (int)$totalRejected,
    "total"     => (int)$totalSubmissions,
];

/* ---------- 3. MATERIALS BY COLLEGE ---------- */
$departments = [];
$stmt = $conn->query("
    SELECT 
        c.collegeName AS name,
        COALESCE(COUNT(ms.materialSubmission_id),0) AS submissions
    FROM college c
    LEFT JOIN course cr      ON cr.college_id = c.college_id
    LEFT JOIN user_course uc ON uc.course_id = cr.course_id
    LEFT JOIN user u         ON u.userCourse_id = uc.userCourse_id
    LEFT JOIN material_submission ms ON ms.user_id = u.user_id
    GROUP BY c.college_id, c.collegeName
    ORDER BY submissions DESC
");
$departments = $stmt ? $stmt->fetchAll(PDO::FETCH_ASSOC) : [];

$recentActions = [];

$stmt = $conn->prepare("
    SELECT
        m.materialName               AS title,
        ms.deanApprovalStatus        AS status,
        ms.deanApprovalDate          AS date,
        col.collegeName              AS college
    FROM material_submission ms
    JOIN material m          ON m.material_id = ms.material_id
    JOIN user u              ON ms.user_id = u.user_id
    JOIN user_course uc      ON u.userCourse_id = uc.userCourse_id
    JOIN course crs          ON uc.course_id = crs.course_id
    JOIN college col         ON crs.college_id = col.college_id
    WHERE crs.college_id = ?
      AND ms.deanApprovalStatus IN ('APPROVED','DENIED','REJECTED')
    ORDER BY ms.deanApprovalDate DESC
    LIMIT 5
");
$stmt->execute([$collegeId]);

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $diff = !empty($row['date']) ? time() - strtotime($row['date']) : 0;
    $timeAgo = $diff < 60 ? "Just now" :
               ($diff < 3600 ? floor($diff/60) . " min ago" :
               ($diff < 86400 ? floor($diff/3600) . " hrs ago" :
                                floor($diff/86400) . " days ago"));

    // Normalize DB value: trim + uppercase
    $dbStatus = strtoupper(trim($row['status'] ?? ''));

    // Default
    $statusDisplay = 'Pending';
    $badgeClass    = 'bg-yellow-100 text-yellow-800';

    if ($dbStatus === 'APPROVED') {
        $statusDisplay = 'Approved';
        $badgeClass    = 'bg-green-100 text-green-800';
    } elseif (in_array($dbStatus, ['DENIED', 'REJECTED'])) {
        $statusDisplay = 'Rejected';
        $badgeClass    = 'bg-red-100 text-red-800';
    }

    $recentActions[] = [
        "title"      => $row['title'] ?? 'Untitled',
        "status"     => $statusDisplay,
        "time"       => $timeAgo,
        "badgeClass" => $badgeClass,
        "college"    => $row['college'] ?? 'Unknown College'
    ];
}

/* ---------- 5. COLLEGE COLORS ---------- */
$collegeColors = [
    'College of Engineering, Architecture & Technology' => 'bg-orange-500',
    'College of Health & Sciences'                     => 'bg-blue-400',
    'College of Education & Sciences'                  => 'bg-green-400',
    'College of Arts & Science'                        => 'bg-purple-400',
    'Business College'                                 => 'bg-red-400',
];

/* ---------- 6. Render HTML ---------- */
include 'deanDashboard.html';
?>