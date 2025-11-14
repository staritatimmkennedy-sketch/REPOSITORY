<?php
require_once __DIR__ . "/../db.php"; 
$totalSubmissions = $conn->query("SELECT COUNT(*) AS total FROM material_submission")->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;
$totalPublished   = $conn->query("SELECT COUNT(*) AS total FROM material_publishing WHERE librarianPublishingStatus = 'PUBLISHED'")->fetch(PDO::FETCH_ASSOC)['total'] ?? 0; 
$totalBorrowed    = $conn->query("SELECT COUNT(*) AS total FROM material_borrowing")->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;
$totalPending     = $conn->query("SELECT COUNT(*) AS total FROM material_submission WHERE deanApprovalStatus = 'PENDING'")->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;
$stats = [
  "submissions" => $totalSubmissions,
  "published"   => $totalPublished,
  "borrowed"    => $totalBorrowed,
  "pending"     => $totalPending,
];

$colleges = [];
$stmt = $conn->query("
  SELECT 
      c.collegeName, 
      COALESCE(COUNT(ms.materialSubmission_id), 0) AS total
  FROM 
      college c
  LEFT JOIN 
      course cr ON cr.college_id = c.college_id
  LEFT JOIN 
      user_course uc ON uc.course_id = cr.course_id
  LEFT JOIN 
      user u ON u.userCourse_id = uc.userCourse_id
  LEFT JOIN 
      material_submission ms ON ms.user_id = u.user_id
  GROUP BY 
      c.college_id, c.collegeName
  ORDER BY 
      total DESC
");

if ($stmt) $colleges = $stmt->fetchAll(PDO::FETCH_ASSOC);

$recentActivity = [];

$stmt = $conn->query("
  SELECT 'Borrow Request' AS type,
         CONCAT(u.lastname, ', ', u.firstname) AS user, 
         m.materialName AS material,
         mb.borrowedDate AS date
  FROM material_borrowing mb
  JOIN material_publishing mp ON mp.callNumber = mb.callNumber
  JOIN material_submission ms ON ms.materialSubmission_id = mp.materialSubmission_id
  JOIN material m ON m.material_id = ms.material_id
  JOIN user u ON u.user_id = mb.student_id
  UNION ALL

  SELECT 'Submission' AS type,
         CONCAT(u.lastname, ', ', u.firstname) AS user, 
         m.materialName AS material,
         ms.submissionDate AS date
  FROM material_submission ms
  JOIN material m ON m.material_id = ms.material_id
  JOIN user u ON u.user_id = ms.user_id
  UNION ALL

  SELECT 'Approval' AS type,
         CONCAT(u.lastname, ', ', u.firstname) AS user,
         m.materialName AS material,
         mp.librarianPublishingDate AS date  
  FROM material_publishing mp
  JOIN material_submission ms ON ms.materialSubmission_id = mp.materialSubmission_id
  JOIN material m ON m.material_id = ms.material_id
  JOIN user u ON u.user_id = ms.user_id
  WHERE mp.librarianPublishingStatus = 'PUBLISHED'  
  ORDER BY date DESC
  LIMIT 5
");

if ($stmt) {
  while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $timeAgo = '';
    if (!empty($row['date'])) {
      $diff = time() - strtotime($row['date']);
      if ($diff < 60) $timeAgo = "1 min ago";
      elseif ($diff < 3600) $timeAgo = floor($diff / 60) . " min ago";
      elseif ($diff < 86400) $timeAgo = floor($diff / 3600) . " hrs ago";
      else $timeAgo = floor($diff / 86400) . " days ago";
    }
    
    $recentActivity[] = [
      "type" => $row["type"],
      "user" => $row["user"],
      "material" => $row["material"],
      "time" => $timeAgo
    ];
  }
}

$collegeColors = [
    'College of Engineering, Architecture & Technology' => 'bg-orange-500',
    'College of Health & Sciences'                      => 'bg-blue-400',
    'College of Education & Sciences'                   => 'bg-green-400',  
    'College of Arts & Science'                         => 'bg-purple-400',
    'Business College'                                  => 'bg-red-400',
];
include 'librarianDashboard.html';