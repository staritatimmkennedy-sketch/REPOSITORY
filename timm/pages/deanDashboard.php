<?php
// Dummy stats for Dean dashboard
$stats = [
  "pending" => 42,
  "approved" => 128,
  "rejected" => 12,
  "total" => 182,
];

// Dummy engagement by department
$departments = [
  ["name" => "College of Engineering", "submissions" => 70],
  ["name" => "College of Health Sciences", "submissions" => 55],
  ["name" => "College of Education", "submissions" => 30],
  ["name" => "Business College", "submissions" => 27],
];

// Dummy recent actions
$recentActions = [
  ["title" => "AI in Education", "status" => "Approved", "time" => "2 hrs ago"],
  ["title" => "Healthcare Robotics", "status" => "Pending", "time" => "Yesterday"],
  ["title" => "Digital Business Trends", "status" => "Rejected", "time" => "2 days ago"],
];
?>

<div id="deanDashboard" class="p-6">
  

  <!-- Stat Cards -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
    <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 p-4 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
      <div class="flex justify-center mb-2">
        <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <p class="text-yellow-700 text-2xl font-bold"><?= $stats["pending"] ?></p>
      <p class="text-gray-600 text-sm">Pending Reviews</p>
    </div>
    <div class="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-4 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
      <div class="flex justify-center mb-2">
        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <p class="text-green-700 text-2xl font-bold"><?= $stats["approved"] ?></p>
      <p class="text-gray-600 text-sm">Approved Materials</p>
    </div>
    <div class="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 p-4 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
      <div class="flex justify-center mb-2">
        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>
      <p class="text-red-700 text-2xl font-bold"><?= $stats["rejected"] ?></p>
      <p class="text-gray-600 text-sm">Rejected Materials</p>
    </div>
    <div class="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-4 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
      <div class="flex justify-center mb-2">
        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      </div>
      <p class="text-blue-700 text-2xl font-bold"><?= $stats["total"] ?></p>
      <p class="text-gray-600 text-sm">Total Decisions</p>
    </div>
  </div>

  <!-- Two-column layout -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Materials by Department -->
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
                <?= $dept['name'] === 'College of Engineering' ? 'bg-orange-400' : 
                   ($dept['name'] === 'College of Health Sciences' ? 'bg-blue-400' : 
                   ($dept['name'] === 'College of Education' ? 'bg-gray-600' : 'bg-red-400')) ?>">
              </span>
              <span class="text-gray-700"><?= htmlspecialchars($dept["name"]) ?></span>
            </div>
            <span class="font-semibold text-blue-600"><?= $dept["submissions"] ?> Materials</span>
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

    <!-- Recent Reviews -->
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