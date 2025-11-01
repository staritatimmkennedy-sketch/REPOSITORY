<?php
require_once __DIR__ . "/../db.php"; 
$totalPending   = $conn->query("SELECT COUNT(*) AS total FROM material_submission WHERE approvalStatus = 'PENDING'")->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;
$totalApproved  = $conn->query("SELECT COUNT(*) AS total FROM material_submission WHERE approvalStatus = 'APPROVED'")->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;
$totalRejected  = $conn->query("SELECT COUNT(*) AS total FROM material_submission WHERE approvalStatus = 'DENIED'")->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;
$totalSubmissions = $totalPending + $totalApproved + $totalRejected;

$stats = [
  "pending"  => $totalPending,
  "approved" => $totalApproved,
  "rejected" => $totalRejected,
  "total"    => $totalSubmissions,
];
$departments = [];
$stmt = $conn->query("
    SELECT 
        c.collegeName AS name, 
        COUNT(ms.materialSubmission_id) AS submissions
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
        submissions DESC
");

if ($stmt) $departments = $stmt->fetchAll(PDO::FETCH_ASSOC);
$recentActions = [];
$stmt = $conn->query("
    SELECT 
        m.materialName AS title,
        ms.approvalStatus AS status,
        ms.approvalDate AS date
    FROM 
        material_submission ms
    JOIN 
        material m ON m.material_id = ms.material_id
    WHERE
        ms.approvalStatus IN ('APPROVED', 'REJECTED')
    ORDER BY 
        ms.approvalDate DESC
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
        
        $recentActions[] = [
            "title" => $row["title"],
            "status" => $row["status"] === 'APPROVED' ? 'Approved' : ($row["status"] === 'REJECTED' ? 'Rejected' : 'Pending'),
            "time" => $timeAgo
        ];
    }
}
?>

<div id="deanDashboard" class="p-6">
  
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
    <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 p-4 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
      <div class="flex justify-center mb-2">
        <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <p class="text-yellow-700 text-2xl font-bold"><?= htmlspecialchars($stats["pending"]) ?></p>
      <p class="text-gray-600 text-sm">Pending Reviews</p>
    </div>
    <div class="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-4 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
      <div class="flex justify-center mb-2">
        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <p class="text-green-700 text-2xl font-bold"><?= htmlspecialchars($stats["approved"]) ?></p>
      <p class="text-gray-600 text-sm">Approved Materials</p>
    </div>
    <div class="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 p-4 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
      <div class="flex justify-center mb-2">
        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>
      <p class="text-red-700 text-2xl font-bold"><?= htmlspecialchars($stats["rejected"]) ?></p>
      <p class="text-gray-600 text-sm">Rejected Materials</p>
    </div>
    <div class="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-4 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
      <div class="flex justify-center mb-2">
        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      </div>
      <p class="text-blue-700 text-2xl font-bold"><?= htmlspecialchars($stats["total"]) ?></p>
      <p class="text-gray-600 text-sm">Total Submissions</p>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div class="bg-white border rounded-xl shadow-sm p-6">
      <div class="flex items-center mb-4">
        <div class="p-2 bg-blue-100 rounded-lg mr-3">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-800">Materials by Department</h3>
      </div>
      
      <div class="space-y-4">
        <?php foreach ($departments as $dept): ?>
          <div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <div class="flex items-center">
              <span class="inline-block w-3 h-3 rounded-full mr-3
                <?php
                // Use original specific color mapping for departments
                if ($dept['name'] === 'College of Engineering') echo 'bg-orange-400';
                elseif ($dept['name'] === 'College of Health Sciences') echo 'bg-blue-400';
                elseif ($dept['name'] === 'College of Education') echo 'bg-gray-600';
                else echo 'bg-red-400'; 
                ?>">
              </span>
              <span class="text-gray-700"><?= htmlspecialchars($dept["name"]) ?></span>
            </div>
            <span class="font-semibold text-blue-600"><?= htmlspecialchars($dept["submissions"]) ?> Materials</span>
          </div>
        <?php endforeach; ?>
      </div>
      
      <div class="mt-6 text-right">
        <a href="index.php?page=department_reports" 
           class="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-300 rounded-lg text-sm font-medium transition-colors inline-flex items-center">
          View Department Reports
          <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </a>
      </div>
    </div>

    <div class="bg-white border rounded-xl shadow-sm p-6">
      <div class="flex items-center mb-4">
        <div class="p-2 bg-green-100 rounded-lg mr-3">
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-800">Recent Reviews</h3>
      </div>
      
      <ul class="divide-y divide-gray-100">
        <?php foreach ($recentActions as $action): ?>
          <li class="py-4 hover:bg-gray-50 transition-colors rounded-lg px-2">
            <div class="flex justify-between items-start mb-2">
              <p class="text-sm font-medium text-gray-900">"<?= htmlspecialchars($action["title"]) ?>"</p>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                <?php if ($action['status'] === 'Approved'): ?>
                  bg-green-100 text-green-800
                <?php elseif ($action['status'] === 'Rejected'): ?>
                  bg-red-100 text-red-800
                <?php else: ?>
                  bg-yellow-100 text-yellow-800
                <?php endif; ?>">
                <?= htmlspecialchars($action["status"]) ?>
              </span>
            </div>
            <p class="text-xs text-gray-500"><?= htmlspecialchars($action["time"]) ?></p>
          </li>
        <?php endforeach; ?>
      </ul>
      
      <div class="mt-4 text-right">
        <a href="index.php?page=review_queue" 
           class="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center">
          View Review Queue
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </a>
      </div>
    </div>
  </div>
</div>