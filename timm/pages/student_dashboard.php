<?php
// Dummy data for student dashboard
$stats = [
    "borrowed" => 3,
    "submissions" => 5,
    "approved" => 2,
    "available" => 5
];

$recentActivities = [
    ["action" => "Borrow Request", "detail" => "Requested 'Database Systems Concepts' (Book)", "time" => "5 mins ago"],
    ["action" => "Submission Approved", "detail" => "Research Paper on Machine Learning", "time" => "20 mins ago"],
    ["action" => "Material Borrowed", "detail" => "'Introduction to Algorithms' by CLRS", "time" => "2 days ago"],
    ["action" => "New Materials Available", "detail" => "5 new books uploaded to repository", "time" => "1 week ago"],
    
];

$currentBorrowed = [
    ["title" => "Introduction to Algorithms", "author" => "CLRS", "due_date" => "2024-01-15", "days_left" => 3],
    ["title" => "Database Systems", "author" => "Elmasri & Navathe", "due_date" => "2024-01-20", "days_left" => 8],
    ["title" => "Computer Networks", "author" => "Andrew Tanenbaum", "due_date" => "2024-01-18", "days_left" => 6]
];
?>

<div id="dashboardContent">
    <div class="p-6 space-y-8">
        <!-- Header -->
      
        
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Borrowed Materials -->
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div class="flex justify-center mb-3">
                    <div class="p-3 bg-blue-100 rounded-lg">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" stroke-width="2"
                             stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3"></path>
                            <path d="M22 2L12 12"></path>
                        </svg>
                    </div>
                </div>
                <p class="text-blue-700 text-2xl font-bold"><?= $stats["borrowed"] ?></p>
                <p class="text-gray-600 text-sm">Currently Borrowed</p>
                <div class="mt-3">
                    <a href="index.php?page=borrowed" class="text-xs text-blue-600 hover:text-blue-800 font-medium">
                        View My Books
                    </a>
                </div>
            </div>

            <!-- Submissions -->
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div class="flex justify-center mb-3">
                    <div class="p-3 bg-purple-100 rounded-lg">
                        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" stroke-width="2"
                             stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                            <path d="M12 20h9M12 4H3M12 12h9M12 8H3M12 16h9"></path>
                        </svg>
                    </div>
                </div>
                <p class="text-purple-700 text-2xl font-bold"><?= $stats["submissions"] ?></p>
                <p class="text-gray-600 text-sm">My Submissions</p>
                <div class="mt-3">
                    <a href="index.php?page=submissions" class="text-xs text-purple-600 hover:text-purple-800 font-medium">
                        View Submissions
                    </a>
                </div>
            </div>

            <!-- Approved Submissions -->
            <div class="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div class="flex justify-center mb-3">
                    <div class="p-3 bg-green-100 rounded-lg">
                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" stroke-width="2"
                             stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                            <path d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                </div>
                <p class="text-green-700 text-2xl font-bold"><?= $stats["approved"] ?></p>
                <p class="text-gray-600 text-sm">Approved Works</p>
                <div class="mt-3">
                    <a href="index.php?page=submissions" class="text-xs text-green-600 hover:text-green-800 font-medium">
                        View Approved
                    </a>
                </div>
            </div>

            <!-- Available Materials -->
            <div class="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div class="flex justify-center mb-3">
                    <div class="p-3 bg-orange-100 rounded-lg">
                        <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" stroke-width="2"
                             stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                            <path d="M4 4h16v13H4z"></path>
                        </svg>
                    </div>
                </div>
                <p class="text-orange-700 text-2xl font-bold"><?= $stats["available"] ?></p>
                <p class="text-gray-600 text-sm">New Materials</p>
                <div class="mt-3">
                    <a href="index.php?page=published" class="text-xs text-orange-600 hover:text-orange-800 font-medium">
                        Browse Library
                    </a>
                </div>
            </div>
        </div>

        <!-- Two Column Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- My Current Borrowed Materials -->
            <div class="bg-white border rounded-xl shadow-sm p-6">
                <div class="flex items-center mb-4">
                    <div class="p-2 bg-blue-100 rounded-lg mr-3">
                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2"
                             stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3"></path>
                            <path d="M22 2L12 12"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-800">My Borrowed Materials</h3>
                </div>
                
                <div class="space-y-4">
                    <?php foreach ($currentBorrowed as $book): ?>
                        <div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                            <div class="flex-1">
                                <p class="font-medium text-gray-800 text-sm"><?= htmlspecialchars($book["title"]) ?></p>
                                <p class="text-xs text-gray-600">by <?= htmlspecialchars($book["author"]) ?></p>
                            </div>
                            <div class="text-right">
                                <p class="text-xs font-medium <?= $book["days_left"] <= 3 ? 'text-red-600' : 'text-green-600' ?>">
                                    <?= $book["days_left"] ?> days left
                                </p>
                                <p class="text-xs text-gray-500">Due: <?= date('M j', strtotime($book["due_date"])) ?></p>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
                
                <div class="mt-6 text-right">
                    <a href="index.php?page=my_borrowed" 
                       class="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-300 rounded-lg text-sm font-medium transition-colors inline-flex items-center">
                        Manage Borrowed Items
                        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </a>
                </div>
            </div>

            <!-- Recent Activities -->
            <div class="bg-white border rounded-xl shadow-sm p-6">
                <div class="flex items-center mb-4">
                    <div class="p-2 bg-green-100 rounded-lg mr-3">
                        <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" stroke-width="2"
                             stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-800">My Recent Activity</h3>
                </div>
                
                <ul class="divide-y divide-gray-100">
                    <?php foreach ($recentActivities as $activity): 
                        $actionColors = [
                            'Borrow Request' => 'bg-yellow-100 text-yellow-800',
                            'Submission Approved' => 'bg-green-100 text-green-800',
                            'Material Borrowed' => 'bg-blue-100 text-blue-800',
                            'New Materials Available' => 'bg-orange-100 text-orange-800'
                        ];
                        $actionColor = $actionColors[$activity["action"]] ?? 'bg-gray-100 text-gray-800';
                    ?>
                        <li class="py-4 hover:bg-gray-50 transition-colors rounded-lg px-2">
                            <div class="flex justify-between items-start mb-2">
                                <div class="flex items-center">
                                    <div class="mr-3">
                                        <?php if ($activity["action"] === "Borrow Request"): ?>
                                            <svg class="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" stroke-width="2"
                                                 stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                                                <path d="M21 12.79A9 9 0 1 1 11.21 3"></path>
                                                <path d="M22 2L12 12"></path>
                                            </svg>
                                        <?php elseif ($activity["action"] === "Submission Approved"): ?>
                                            <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" stroke-width="2"
                                                 stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                                                <path d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        <?php elseif ($activity["action"] === "Material Borrowed"): ?>
                                            <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" stroke-width="2"
                                                 stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                                                <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                                            </svg>
                                        <?php else: ?>
                                            <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" stroke-width="2"
                                                 stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                                <path d="M4 4h16v13H4z"></path>
                                            </svg>
                                        <?php endif; ?>
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-900"><?= htmlspecialchars($activity["action"]) ?></p>
                                        <p class="text-sm text-gray-600 mt-1"><?= htmlspecialchars($activity["detail"]) ?></p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <span class="text-xs px-2 py-1 rounded-full <?= $actionColor ?>"><?= htmlspecialchars($activity["action"]) ?></span>
                                    <p class="text-xs text-gray-500 mt-2"><?= htmlspecialchars($activity["time"]) ?></p>
                                </div>
                            </div>
                        </li>
                    <?php endforeach; ?>
                </ul>
                
                <div class="mt-4 text-right">
                    <a href="index.php?page=activity_log" 
                       class="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center">
                        View All My Activity
                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>