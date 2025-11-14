<?php
// Dummy data for dashboard
$stats = [
    "users" => 120,
    "roles" => 5,
    "materials" => 342
];

$recentActivities = [
    ["action" => "User Registered", "detail" => "John Doe (Student)", "time" => "2 mins ago"],
    ["action" => "Material Added", "detail" => "‘Introduction to AI’ (Book)", "time" => "15 mins ago"],
    ["action" => "Material Borrowed", "detail" => "‘Data Structures and Algorithms’ by Mark Weiss", "time" => "30 mins ago"],
    ["action" => "Role Assigned", "detail" => "Tim Kennedy as Faculty", "time" => "1 hour ago"],
    ["action" => "Submission Approved", "detail" => "Thesis on Web Security", "time" => "2 hours ago"],
];
?>

<div id="dashboardContent">
    <div class="p-6 space-y-8">

       
    
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <!-- Users -->
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center">
                    <div class="p-3 bg-blue-100 rounded-lg mr-4">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" 
                             stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                            <path d="M20 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M4 21v-2a4 4 0 0 1 3-3.87"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                    <div>
                        <h2 class="text-gray-600 text-sm font-medium">Total Users</h2>
                        <p class="text-2xl font-bold text-blue-700"><?= $stats["users"] ?></p>
                    </div>
                </div>
                <div class="mt-4 text-right">
                    <a href="index.php?page=users" class="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center">
                        Manage Users
                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </a>
                </div>
            </div>

            <!-- Roles -->
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center">
                    <div class="p-3 bg-purple-100 rounded-lg mr-4">
                        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" stroke-width="2" 
                             stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                            <path d="M12 12c2.28 0 4-1.72 4-4s-1.72-4-4-4-4 1.72-4 4 1.72 4 4 4z"></path>
                            <path d="M6 22v-2c0-2.67 2.33-4 6-4s6 1.33 6 4v2"></path>
                        </svg>
                    </div>
                    <div>
                        <h2 class="text-gray-600 text-sm font-medium">Roles</h2>
                        <p class="text-2xl font-bold text-purple-700"><?= $stats["roles"] ?></p>
                    </div>
                </div>
                <div class="mt-4 text-right">
                    <a href="index.php?page=roles" class="text-sm text-purple-600 hover:text-purple-800 font-medium inline-flex items-center">
                        Manage Roles
                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </a>
                </div>
            </div>

            <!-- Materials -->
            <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center">
                    <div class="p-3 bg-yellow-100 rounded-lg mr-4">
                        <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" stroke-width="2" 
                             stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                            <path d="M4 4h16v13H4z"></path>
                        </svg>
                    </div>
                    <div>
                        <h2 class="text-gray-600 text-sm font-medium">Materials</h2>
                        <p class="text-2xl font-bold text-yellow-700"><?= $stats["materials"] ?></p>
                    </div>
                </div>
                <div class="mt-4 text-right">
                    <a href="index.php?page=materials" class="text-sm text-yellow-600 hover:text-yellow-800 font-medium inline-flex items-center">
                        Manage Materials
                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </a>
                </div>
            </div>

        </div>

        <!-- Recent Activities -->
        <div class="bg-white border rounded-xl shadow-sm p-6">
            <div class="flex items-center mb-6">
                <div class="p-2 bg-green-100 rounded-lg mr-3">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" stroke-width="2" 
                         stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                        <path d="M17 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10z"></path>
                        <path d="M12 11h4M12 15h4M8 11h.01M8 15h.01"></path>
                    </svg>
                </div>
                <h2 class="text-lg font-semibold text-gray-800">Recent Activities</h2>
            </div>
            
            <ul class="divide-y divide-gray-100">
                <?php foreach ($recentActivities as $activity): 
                    $actionColors = [
                        'User Registered' => 'bg-blue-100 text-blue-800',
                        'Material Added' => 'bg-green-100 text-green-800',
                        'Material Borrowed' => 'bg-yellow-100 text-yellow-800',
                        'Role Assigned' => 'bg-purple-100 text-purple-800',
                        'Submission Approved' => 'bg-green-100 text-green-800'
                    ];
                    $actionColor = $actionColors[$activity["action"]] ?? 'bg-gray-100 text-gray-800';
                ?>
                    <li class="py-4 hover:bg-gray-50 transition-colors rounded-lg px-2">
                        <div class="flex justify-between items-start mb-2">
                            <div class="flex items-center">
                                <div class="mr-3">
                                    <?php if ($activity["action"] === "User Registered"): ?>
                                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" 
                                             stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                                            <path d="M20 21v-2a4 4 0 0 0-3-3.87"></path>
                                            <path d="M4 21v-2a4 4 0 0 1 3-3.87"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                    <?php elseif ($activity["action"] === "Material Added"): ?>
                                        <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" stroke-width="2" 
                                             stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                            <path d="M4 4h16v13H4z"></path>
                                        </svg>
                                    <?php elseif ($activity["action"] === "Material Borrowed"): ?>
                                        <svg class="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" stroke-width="2" 
                                             stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                                            <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                                        </svg>
                                    <?php elseif ($activity["action"] === "Role Assigned"): ?>
                                        <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" stroke-width="2" 
                                             stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                                            <path d="M12 12c2.28 0 4-1.72 4-4s-1.72-4-4-4-4 1.72-4 4 1.72 4 4 4z"></path>
                                            <path d="M6 22v-2c0-2.67 2.33-4 6-4s6 1.33 6 4v2"></path>
                                        </svg>
                                    <?php else: ?>
                                        <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" stroke-width="2" 
                                             stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
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
            
            <div class="mt-6 text-right">
                <a href="index.php?page=activity_log" 
                   class="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center">
                    View All Activities
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </a>
            </div>
        </div>
    </div>
</div>