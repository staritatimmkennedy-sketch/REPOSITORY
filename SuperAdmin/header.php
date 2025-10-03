<?php 
// NOTE: $pageTitle is defined in index.php and is available here.
$title = isset($pageTitle) ? $pageTitle : 'System Admin Dashboard';
?>
<header class="bg-white border-b border-gray-200 shadow-sm">
    <div class="flex justify-between items-center px-6 py-4">
        <!-- Left Section: Page Title -->
        <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-800" id="pageTitle"><?php echo $title; ?></h1>
        </div>

        <!-- Right Section: User Profile -->
        <div class="flex items-center space-x-4">
            <!-- Notifications Bell -->
          

            <!-- User Profile Dropdown -->
            <div class="relative group">
                <button class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <!-- User Avatar -->
                    <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span class="text-white text-sm font-semibold">B</span>
                    </div>
                    
                    <!-- User Info -->
                    <div class="text-left">
                        <p class="text-sm font-semibold text-gray-800">xX_Badboy17_Xx</p>
                        <p class="text-xs text-gray-500">Administrator</p>
                    </div>
                    
                    <!-- Chevron Icon -->
                    <svg class="w-4 h-4 text-gray-500 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>

                <!-- Dropdown Menu -->
                <div class="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <!-- User Summary -->
                    <div class="p-4 border-b border-gray-100">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                <span class="text-white text-sm font-semibold">B</span>
                            </div>
                            <div>
                                <p class="font-semibold text-gray-800">xX_Badboy17_Xx</p>
                                <p class="text-sm text-gray-500">admin@university.edu</p>
                            </div>
                        </div>
                    </div>

                    <!-- Menu Items -->
                    <div class="p-2">
                        <a href="#" class="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                            <span class="text-sm text-gray-700">Profile Settings</span>
                        </a>
                        <a href="#" class="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <span class="text-sm text-gray-700">Account Settings</span>
                        </a>
                        
                    </div>

                    <!-- Divider -->
                    <div class="border-t border-gray-100"></div>

                    <!-- Logout -->
                    <div class="p-2">
                        <a href="#" class="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors group">
                            <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                            </svg>
                            <span class="text-sm text-red-600 group-hover:text-red-700">Logout</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</header>