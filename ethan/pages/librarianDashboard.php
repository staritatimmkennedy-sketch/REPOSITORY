<?php
require_once __DIR__ . "/../db.php"; 
$totalSubmissions = $conn->query("SELECT COUNT(*) AS total FROM material_submission")->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;
$totalPublished   = $conn->query("SELECT COUNT(*) AS total FROM material_publishing WHERE approvalStatus = 'PUBLISHED'")->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;
$totalBorrowed    = $conn->query("SELECT COUNT(*) AS total FROM material_borrowing")->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;
$totalPending     = $conn->query("SELECT COUNT(*) AS total FROM material_submission WHERE approvalStatus = 'PENDING'")->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;
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
      COUNT(ms.materialSubmission_id) AS total
  FROM 
      material_submission ms
  JOIN 
      user u ON u.user_id = ms.user_id
  LEFT JOIN 
      user_course uc ON uc.userCourse_id = u.userCourse_id
  LEFT JOIN 
      course cr ON cr.course_id = uc.course_id
  LEFT JOIN 
      college c ON c.college_id = cr.college_id
  WHERE
      c.collegeName IS NOT NULL
  GROUP BY 
      c.collegeName
  ORDER BY 
      total DESC
");

if ($stmt) $colleges = $stmt->fetchAll(PDO::FETCH_ASSOC);
$recentActivity = [];

$stmt = $conn->query("
  -- 1. Borrow Request
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

  -- 2. Submission
  SELECT 'Submission' AS type,
         CONCAT(u.lastname, ', ', u.firstname) AS user, 
         m.materialName AS material,
         ms.submissionDate AS date
  FROM material_submission ms
  JOIN material m ON m.material_id = ms.material_id
  JOIN user u ON u.user_id = ms.user_id

  UNION ALL

  -- 3. Approval
  SELECT 'Approval' AS type,
         CONCAT(u.lastname, ', ', u.firstname) AS user,
         m.materialName AS material,
         mp.approvalDate AS date
  FROM material_publishing mp
  JOIN material_submission ms ON ms.materialSubmission_id = mp.materialSubmission_id
  JOIN material m ON m.material_id = ms.material_id
  JOIN user u ON u.user_id = ms.user_id

  ORDER BY date DESC
  LIMIT 5
");

if ($stmt) {
  while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $timeAgo = '';
    if (!empty($row['date'])) {
      $diff = time() - strtotime($row['date']);
      
      // TimeAgo calculation logic
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
if ($stmt) {
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $timeAgo = '';
        if (!empty($row['date'])) {
            $diff = time() - strtotime($row['date']);
            
            // TimeAgo calculation logic
            if ($diff < 60) $timeAgo = "1 min ago"; // Less than 1 min ago is not common practice for dashboards, usually just 'moments ago' or '1 min ago'
            elseif ($diff < 3600) $timeAgo = floor($diff / 60) . " min ago";
            elseif ($diff < 86400) $timeAgo = floor($diff / 3600) . " hrs ago";
            else $timeAgo = floor($diff / 86400) . " days ago";
        }
        
        $recentActions[] = [
            "title" => $row["title"],
            "status" => $row["status"] === 'APPROVED' ? 'Approved' : ($row["status"] === 'REJECTED' ? 'Rejected' : 'Pending'),
            "time" => $timeAgo
        ];
    }
}
?>

<div id="librarianDashboard" class="p-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-4 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
            <div class="flex justify-center mb-2">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
            </div>
            <p class="text-blue-700 text-2xl font-bold"><?= htmlspecialchars($stats["submissions"]) ?></p>
            <p class="text-gray-600 text-sm">Total Submissions</p>
        </div>

        <div class="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-4 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
            <div class="flex justify-center mb-2">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            </div>
            <p class="text-green-700 text-2xl font-bold"><?= htmlspecialchars($stats["published"]) ?></p>
            <p class="text-gray-600 text-sm">Published Materials</p>
        </div>

        <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 p-4 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
            <div class="flex justify-center mb-2">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                </svg>
            </div>
            <p class="text-yellow-700 text-2xl font-bold"><?= htmlspecialchars($stats["borrowed"]) ?></p>
            <p class="text-gray-600 text-sm">Borrowed Materials</p>
        </div>

        <div class="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 p-4 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
            <div class="flex justify-center mb-2">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            </div>
            <p class="text-red-700 text-2xl font-bold"><?= htmlspecialchars($stats["pending"]) ?></p>
            <p class="text-gray-600 text-sm">Pending Approvals</p>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white border rounded-xl shadow-sm p-6">
            <div class="flex items-center mb-4">
                <div class="p-2 bg-blue-100 rounded-lg mr-3">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-800">Materials by College</h3>
            </div>

            <div class="space-y-4">
                <?php foreach ($colleges as $college): ?>
                    <div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <div class="flex items-center">
                            <span class="inline-block w-3 h-3 rounded-full bg-blue-400 mr-3"></span>
                            <span><?= htmlspecialchars($college["collegeName"]) ?></span>
                        </div>
                        <span class="font-semibold text-blue-600"><?= htmlspecialchars($college["total"]) ?> Materials</span>
                    </div>
                <?php endforeach; ?>
            </div>

            <div class="mt-6 text-right">
                <a href="index.php?page=librarianColleges" 
                   class="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-300 rounded-lg text-sm font-medium transition-colors inline-flex items-center">
                    View College Reports
                    <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </a>
            </div>
        </div>

        <div class="bg-white border rounded-xl shadow-sm p-6">
            <div class="flex items-center mb-4">
                <div class="p-2 bg-green-100 rounded-lg mr-3">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-800">Recent Materials Activity</h3>
            </div>

            <ul class="divide-y divide-gray-100">
                <?php foreach ($recentActivity as $activity):
                    $typeColors = [
                        'Borrow Request' => 'bg-yellow-100 text-yellow-800',
                        'Submission' => 'bg-blue-100 text-blue-800',
                        'Approval' => 'bg-green-100 text-green-800'
                    ];
                    $typeColor = $typeColors[$activity["type"]] ?? 'bg-gray-100 text-gray-800';
                ?>
                <li class="py-4 hover:bg-gray-50 transition-colors rounded-lg px-2">
                    <div class="flex justify-between items-start mb-1">
                        <span class="text-sm font-medium text-gray-900"><?= htmlspecialchars($activity["user"]) ?></span>
                        <span class="text-xs px-2 py-1 rounded-full <?= $typeColor ?>"><?= htmlspecialchars($activity["type"]) ?></span>
                    </div>
                    <p class="text-sm text-gray-600 mb-1">Material: "<?= htmlspecialchars($activity["material"]) ?>"</p>
                    <p class="text-xs text-gray-500"><?= htmlspecialchars($activity["time"]) ?></p>
                </li>
                <?php endforeach; ?>
            </ul>
        </div>
    </div>
</div>