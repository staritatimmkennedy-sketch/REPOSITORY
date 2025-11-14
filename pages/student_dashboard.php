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

/* ===================== STATS CARDS ===================== */
$stmt = $conn->prepare("
    SELECT COUNT(*) AS total
    FROM material_borrowing
    WHERE student_id = ? AND borrowStatus = 'APPROVED'
");
$stmt->execute([$userId]);
$totalBorrowed = $stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;

$stmt = $conn->prepare("
    SELECT COUNT(*) AS total
    FROM material_submission
    WHERE user_id = ?
");
$stmt->execute([$userId]);
$totalSubmissions = $stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;

$stmt = $conn->prepare("
    SELECT COUNT(*) AS total
    FROM material_submission ms
    JOIN material_publishing mp ON ms.materialSubmission_id = mp.materialSubmission_id
    WHERE ms.user_id = ?
      AND ms.deanApprovalStatus = 'APPROVED'
      AND mp.librarianPublishingStatus = 'PUBLISHED'
");
$stmt->execute([$userId]);
$totalApproved = $stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;

$stmt = $conn->prepare("
    SELECT COUNT(*) AS total
    FROM material_publishing
    WHERE librarianPublishingStatus = 'PUBLISHED'
");
$stmt->execute();
$totalAvailable = $stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;

$stats = [
    "borrowed"    => (int)$totalBorrowed,
    "submissions" => (int)$totalSubmissions,
    "approved"    => (int)$totalApproved,
    "available"   => (int)$totalAvailable
];

/* ===================== CURRENT BORROWED ===================== */
$currentBorrowed = [];
$stmt = $conn->prepare("
    SELECT
        m.materialName AS title,
        m.author_lastname,
        m.author_firstname,
        mb.dueDate
    FROM material_borrowing mb
    LEFT JOIN material_publishing mp ON mb.callNumber = mp.callNumber
    LEFT JOIN material_submission ms ON mp.materialSubmission_id = ms.materialSubmission_id
    LEFT JOIN material m ON ms.material_id = m.material_id
    WHERE mb.student_id = ?
      AND mb.borrowStatus = 'APPROVED'
    ORDER BY mb.dueDate ASC
");
$stmt->execute([$userId]);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($rows as $r) {
    $daysLeft = '';
    if (!empty($r['dueDate'])) {
        $due   = strtotime($r['dueDate']);
        $today = strtotime('today');
        $daysLeft = floor(($due - $today) / 86400);
    }
    $currentBorrowed[] = [
        "title"      => $r['title'] ?? "Untitled",
        "author"     => trim(($r['author_firstname'] ?? '') . ' ' . ($r['author_lastname'] ?? '')),
        "due_date"   => $r['dueDate'],
        "days_left"  => $daysLeft
    ];
}

/* ===================== RECENT ACTIVITIES (Uploads + Borrows) ===================== */
$recentActivities = [];

// 1. Submission Activities
$stmt = $conn->prepare("
    SELECT
        m.materialName AS title,
        ms.deanApprovalStatus AS status,
        ms.deanApprovalDate AS date,
        'SUBMISSION' AS type
    FROM material_submission ms
    JOIN material m ON m.material_id = ms.material_id
    WHERE ms.user_id = ?
    ORDER BY ms.deanApprovalDate DESC
    LIMIT 10
");
$stmt->execute([$userId]);
$submissionRows = $stmt->fetchAll(PDO::FETCH_ASSOC);

// 2. Borrowing Activities — FIXED: Column is `borrowDate`, not `mb.borrowDate`
$stmt = $conn->prepare("
    SELECT
        m.materialName AS title,
        mb.borrowedDate AS date,
        'BORROWED' AS type
    FROM material_borrowing mb
    LEFT JOIN material_publishing mp ON mb.callNumber = mp.callNumber
    LEFT JOIN material_submission ms ON mp.materialSubmission_id = ms.materialSubmission_id
    LEFT JOIN material m ON ms.material_id = m.material_id
    WHERE mb.student_id = ?
      AND mb.borrowStatus = 'APPROVED'
    ORDER BY mb.borrowedDate DESC
    LIMIT 10
");
$stmt->execute([$userId]);
$borrowRows = $stmt->fetchAll(PDO::FETCH_ASSOC);

// 3. Combine, sort by date, keep latest 5
$allActivities = array_merge($submissionRows, $borrowRows);
usort($allActivities, function($a, $b) {
    return strtotime($b['date'] ?? 'now') <=> strtotime($a['date'] ?? 'now');
});
$allActivities = array_slice($allActivities, 0, 5);

foreach ($allActivities as $act) {
    $diff = time() - strtotime($act['date'] ?? 'now');
    $timeAgo = $diff < 60 ? "Just now" :
               ($diff < 3600 ? floor($diff / 60) . " min ago" :
               ($diff < 86400 ? floor($diff / 3600) . " hrs ago" :
               floor($diff / 86400) . " days ago"));

    if ($act['type'] === 'BORROWED') {
        $action = "Borrowed Material";
        $detail = $act['title'] ?? "Unknown Material";
    } else {
        $status = $act['status'];
        $action = match ($status) {
            'APPROVED'           => "Submission Approved",
            'DENIED', 'REJECTED' => "Submission Denied",
            'PENDING'            => "Under Review",
            'PUBLISHED'          => "Published Work",
            default              => "Submitted"
        };
        $detail = $act['title'];
    }

    $recentActivities[] = [
        "action"  => $action,
        "detail"  => $detail,
        "time"    => $timeAgo
    ];
}

include 'student_dashboard.html';