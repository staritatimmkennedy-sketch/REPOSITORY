<?php
// Dummy statistics for librarian dashboard
$stats = [
  "submissions" => 360,
  "published" => 303,
  "borrowed" => 257,
  "pending" => 57,
];

// Dummy recent activity
$recentActivity = [
  ["type" => "Borrow Request", "user" => "Juan Dela Cruz", "material" => "AI in Education", "time" => "2 hrs ago"],
  ["type" => "Submission", "user" => "Anna Reyes", "material" => "Green Architecture Design", "time" => "5 hrs ago"],
  ["type" => "Approval", "user" => "Dean Smith", "material" => "Digital Transformation in SMEs", "time" => "Yesterday"],
];
?>

<div id="librarianDashboard" class="p-6">


  <!-- Overview Cards -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
    <div class="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-4 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
      <div class="flex justify-center mb-2">
        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      </div>
      <p class="text-blue-700 text-2xl font-bold"><?= $stats["submissions"] ?></p>
      <p class="text-gray-600 text-sm">Total Submissions</p>
    </div>
    <div class="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-4 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
      <div class="flex justify-center mb-2">
        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <p class="text-green-700 text-2xl font-bold"><?= $stats["published"] ?></p>
      <p class="text-gray-600 text-sm">Published Materials</p>
    </div>
    <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 p-4 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
      <div class="flex justify-center mb-2">
        <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
        </svg>
      </div>
      <p class="text-yellow-700 text-2xl font-bold"><?= $stats["borrowed"] ?></p>
      <p class="text-gray-600 text-sm">Borrowed Materials</p>
    </div>
    <div class="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 p-4 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
      <div class="flex justify-center mb-2">
        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <p class="text-red-700 text-2xl font-bold"><?= $stats["pending"] ?></p>
      <p class="text-gray-600 text-sm">Approved Submissions</p>
    </div>
  </div>

  <!-- Two-column layout -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Engagement by College -->
    <div class="bg-white border rounded-xl shadow-sm p-6">
      <div class="flex items-center mb-4">
        <div class="p-2 bg-blue-100 rounded-lg mr-3">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-800">Materials by College</h3>
      </div>
      
      <div class="space-y-4">
        <div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <div class="flex items-center">
            <span class="inline-block w-3 h-3 rounded-full bg-orange-400 mr-3"></span>
            <span>College of Engineering</span>
          </div>
          <span class="font-semibold text-blue-600">120 Materials</span>
        </div>
        <div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <div class="flex items-center">
            <span class="inline-block w-3 h-3 rounded-full bg-blue-400 mr-3"></span>
            <span>College of Health Sciences</span>
          </div>
          <span class="font-semibold text-blue-600">85 Materials</span>
        </div>
        <div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <div class="flex items-center">
            <span class="inline-block w-3 h-3 rounded-full bg-gray-600 mr-3"></span>
            <span>College of Education</span>
          </div>
          <span class="font-semibold text-blue-600">60 Materials</span>
        </div>
        <div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <div class="flex items-center">
            <span class="inline-block w-3 h-3 rounded-full bg-red-400 mr-3"></span>
            <span>Business College</span>
          </div>
          <span class="font-semibold text-blue-600">95 Materials</span>
        </div>
      </div>
      
      <div class="mt-6 text-right">
        <a href="index.php?page=librarianColleges" 
           class="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-300 rounded-lg text-sm font-medium transition-colors inline-flex items-center">
          View College Reports
          <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </a>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white border rounded-xl shadow-sm p-6">
      <div class="flex items-center mb-4">
        <div class="p-2 bg-green-100 rounded-lg mr-3">
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
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
      
      <div class="mt-4 text-right">
        <a href="index.php?page=activity" 
           class="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center">
          View All Materials Activity
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </a>
      </div>
    </div>
  </div>
</div>