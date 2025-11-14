<?php
require_once __DIR__ . "/db.php"; 

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$pageTitle = $pageTitle ?? 'System Admin Dashboard';

$userName = "User";
$userInitial = "U";

if (isset($_SESSION['user_id'])) {
    $userId = $_SESSION['user_id'];
    $stmt = $conn->prepare("
        SELECT u.username, r.roleName 
        FROM user u
        LEFT JOIN role r ON u.role_id = r.role_id
        WHERE u.user_id = ?
    ");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        $userName = $user['username'];
        $userRole = $user['roleName'] ?? "User";
        $userInitial = strtoupper(substr($userName, 0, 1));
    }
}

$title = $pageTitle;
?>
<header class="bg-white border-b border-gray-200 shadow-sm">
    <div class="flex justify-between items-center px-6 py-4">

        <h1 class="text-2xl font-bold text-gray-800" id="pageTitle">
            <?= htmlspecialchars($title) ?>
        </h1>

        <div class="flex items-center space-x-4">
            <div class="relative group">
                <button class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    
                    <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span class="text-white text-sm font-semibold">
                            <?= htmlspecialchars($userInitial) ?>
                        </span>
                    </div>

                    <div class="text-left">
                        <p class="text-sm font-semibold text-gray-800">
                            <?= htmlspecialchars($userName) ?>
                        </p>
                        <p class="text-xs text-gray-500">
                            <?= htmlspecialchars($userRole) ?>
                        </p>
                    </div>

                    <svg class="w-4 h-4 text-gray-500 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>

                <div class="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">

                    <div class="p-4 border-b border-gray-100 flex items-center space-x-3">
                        <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <span class="text-white text-sm font-semibold"><?= htmlspecialchars($userInitial) ?></span>
                        </div>
                        <div>
                            <p class="font-semibold text-gray-800"><?= htmlspecialchars($userName) ?></p>
                       
                        </div>
                    </div>

                

                    <div class="border-t border-gray-100"></div>

                    <div class="p-2">
                        <a href="index.html" class="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-50 group">
                            <span class="text-sm text-red-600 group-hover:text-red-700">Logout</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</header>
