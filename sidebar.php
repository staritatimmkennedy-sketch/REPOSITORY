<?php 
session_start();

// Role comes from login.php (hardcoded accounts for now)
$role = $_SESSION['role'] ?? 'Guest';

// Active page
$current = isset($currentPage) ? $currentPage : 'dashboard';
?>

<aside class="w-64 cf-sidebar p-6 flex flex-col justify-between bg-white border-r border-gray-200">
  <div>
    <!-- Logo -->
    <div class="flex items-center mb-10">
      <img src="logo.png" alt="logo" class="w-40 h-12 mr-2">
    </div>

    <!-- SYSTEM MENU -->
    <nav class="space-y-2"
         x-data="{ 
           openMenu: '<?php 
             echo in_array($current, ['users','role']) ? 'people' : 
                  (in_array($current, ['materials','materialType']) ? 'materials' : 
                  (in_array($current, ['college','course']) ? 'acad' : '')); ?>'
         }">

      <div class="text-gray-500 uppercase text-xs font-bold mb-2">System</div>

    <!--SYS ADMIN-->
    <?php if ($role === "Admin"): ?>
        <!-- Dashboard -->
        <a href="main.php?page=adminDashboard"
           class="cf-nav-item <?php echo ($current === 'adminDashboard') ? 'active' : ''; ?>">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-3 flex-shrink-0">
             <path stroke-linecap="round" stroke-linejoin="round" 
                   d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"/>
           </svg>
           Dashboard
        </a>
        <!-- People -->
        <div>
          <button @click="openMenu = (openMenu === 'people' ? '' : 'people')"
                  class="flex items-center justify-between w-full cf-nav-item">
            <span class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                   stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-3 flex-shrink-0">
                <path stroke-linecap="round" stroke-linejoin="round" 
                      d="M18 18.72a9.094 9.094 0 0 0 3.741-.479
                         3 3 0 0 0-4.682-2.72m.94 3.198.001.031
                         c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21
                         c-2.17 0-4.207-.576-5.963-1.584
                         A6.062 6.062 0 0 1 6 18.719m12 0
                         a5.971 5.971 0 0 0-.941-3.197m0 0
                         A5.995 5.995 0 0 0 12 12.75
                         a5.995 5.995 0 0 0-5.058 2.772
                         m0 0a3 3 0 0 0-4.681 2.72
                         8.986 8.986 0 0 0 3.74.477
                         m.94-3.197a5.971 5.971 0 0 0-.94 3.197
                         M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3
                         a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0
                         Zm-13.5 0a2.25 2.25 0 1 1-4.5 0
                         2.25 2.25 0 0 1 4.5 0Z"/>
              </svg>
              People
            </span>
            <svg :class="{'rotate-180': openMenu === 'people'}" 
                 class="w-4 h-4 transition-transform flex-shrink-0" 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" 
                    stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div x-show="openMenu === 'people'" x-collapse 
               class="ml-6 mt-2 space-y-1">
            <a href="main.php?page=users" 
               class="cf-sub-item <?php echo ($current === 'users') ? 'active' : ''; ?>">Users</a>
            <a href="main.php?page=role" 
               class="cf-sub-item <?php echo ($current === 'role') ? 'active' : ''; ?>">Roles</a>
          </div>
        </div>

        <!-- Materials -->
        <div>
          <button @click="openMenu = (openMenu === 'materials' ? '' : 'materials')"
                  class="flex items-center justify-between w-full cf-nav-item">
            <span class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                   stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-3 flex-shrink-0">
                <path stroke-linecap="round" stroke-linejoin="round" 
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375
                         h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5
                         a3.375 3.375 0 0 0-3.375-3.375H8.25
                         m0 12.75h7.5m-7.5 3H12
                         M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125
                         v17.25c0 .621.504 1.125 1.125 1.125h12.75
                         c.621 0 1.125-.504 1.125-1.125V11.25
                         a9 9 0 0 0-9-9Z"/>
              </svg>
              Materials
            </span>
            <svg :class="{'rotate-180': openMenu === 'materials'}" 
                 class="w-4 h-4 transition-transform flex-shrink-0" 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" 
                    stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div x-show="openMenu === 'materials'" x-collapse 
               class="ml-6 mt-2 space-y-1">
            <a href="main.php?page=materials" 
               class="cf-sub-item <?php echo ($current === 'materials') ? 'active' : ''; ?>">Material Records</a>
            <a href="main.php?page=materialType" 
               class="cf-sub-item <?php echo ($current === 'materialType') ? 'active' : ''; ?>">Material Types</a>
          </div>
        </div>

        <!-- Academics -->
        <div>
          <button @click="openMenu = (openMenu === 'acad' ? '' : 'acad')"
                  class="flex items-center justify-between w-full cf-nav-item">
            <span class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" 
                   stroke="currentColor" stroke-width="1.5" stroke-linecap="round" 
                   stroke-linejoin="round" class="w-5 h-5 mr-3 flex-shrink-0">
                <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18
                         a2 2 0 0 0-1.66 0L2.6 9.08
                         a1 1 0 0 0 0 1.832l8.57 3.908
                         a2 2 0 0 0 1.66 0z"/>
                <path d="M22 10v6"/>
                <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>
              </svg>
              Academics
            </span>
            <svg :class="{'rotate-180': openMenu === 'acad'}" 
                 class="w-4 h-4 transition-transform flex-shrink-0" 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" 
                    stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div x-show="openMenu === 'acad'" x-collapse 
               class="ml-6 mt-2 space-y-1">
            <a href="main.php?page=college" 
               class="cf-sub-item <?php echo ($current === 'college') ? 'active' : ''; ?>">Colleges</a>
            <a href="main.php?page=course" 
               class="cf-sub-item <?php echo ($current === 'course') ? 'active' : ''; ?>">Courses</a>
          </div>
        </div>

        <!-- Audit Logs -->
        <a href="main.php?page=logs" 
           class="cf-nav-item <?php echo ($current === 'logs') ? 'active' : ''; ?>">
           <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                   d="M9 17v-2h6v2H9zm0-4v-2h6v2H9zm-3 8h12a2 2 0 002-2V5
                      a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z"/>
           </svg>
           Audit Logs
        </a>

    <!--STUDENT/FACULTY-->
    <?php elseif ($role === "Student" || $role === "Faculty"): ?>
        <!-- Dashboard -->
        <a href="main.php?page=student_dashboard"
            class="cf-nav-item <?php echo ($current === 'student_dashboard') ? 'active' : ''; ?>">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                  stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-3 flex-shrink-0">
               <path stroke-linecap="round" stroke-linejoin="round" 
                     d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"/>
            </svg>
            Dashboard
        </a>

        <!-- Submissions -->
        <a href="main.php?page=submissions" 
            class="cf-nav-item <?php echo ($current === 'submissions') ? 'active' : ''; ?>">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                  stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-3 flex-shrink-0">
               <path stroke-linecap="round" stroke-linejoin="round" 
                     d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
           My Submissions
        </a>

        <!-- Borrowed Materials -->
        <a href="main.php?page=userBorrowedMaterials" 
            class="cf-nav-item <?php echo ($current === 'userBorrowedMaterials') ? 'active' : ''; ?>">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                  stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-3 flex-shrink-0">
               <path stroke-linecap="round" stroke-linejoin="round" 
                     d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
            </svg>
            Borrowed Materials
        </a>

        <!-- Published Materials -->
        <a href="main.php?page=published" 
            class="cf-nav-item <?php echo ($current === 'published') ? 'active' : ''; ?>">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                  stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-3 flex-shrink-0">
               <path stroke-linecap="round" stroke-linejoin="round" 
                     d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375
                        h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5
                        a3.375 3.375 0 0 0-3.375-3.375H8.25
                        m0 12.75h7.5m-7.5 3H12
                        M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125
                        v17.25c0 .621.504 1.125 1.125 1.125h12.75
                        c.621 0 1.125-.504 1.125-1.125V11.25
                        a9 9 0 0 0-9-9Z"/>
            </svg>
            Published Materials
        </a>

    <!--DEAN-->
    <?php elseif ($role === "Dean"): ?>
        <!-- Dashboard -->
        <a href="main.php?page=deanDashboard"
            class="cf-nav-item <?php echo ($current === 'deanDashboard') ? 'active' : ''; ?>">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-3 flex-shrink-0">
                <path stroke-linecap="round" stroke-linejoin="round" 
                    d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"/>
            </svg>
            Dashboard
        </a>
     <!-- Borrowed Materials -->
     <a href="main.php?page=userBorrowedMaterials" 
            class="cf-nav-item <?php echo ($current === 'userBorrowedMaterials') ? 'active' : ''; ?>">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                  stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-3 flex-shrink-0">
               <path stroke-linecap="round" stroke-linejoin="round" 
                     d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
            </svg>
            Borrowed Materials
        </a>

        <!-- Submissions -->
        <a href="main.php?page=deanSubmissions"
            class="cf-nav-item <?php echo ($current === 'deanSubmissions') ? 'active' : ''; ?>">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-3 flex-shrink-0">
                <path stroke-linecap="round" stroke-linejoin="round" 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Submissions
        </a>

        <!-- Published Materials -->
        <a href="main.php?page=published" 
            class="cf-nav-item <?php echo ($current === 'published') ? 'active' : ''; ?>">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-3 flex-shrink-0">
                <path stroke-linecap="round" stroke-linejoin="round" 
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375
                        h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5
                        a3.375 3.375 0 0 0-3.375-3.375H8.25
                        m0 12.75h7.5m-7.5 3H12
                        M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125
                        v17.25c0 .621.504 1.125 1.125 1.125h12.75
                        c.621 0 1.125-.504 1.125-1.125V11.25
                        a9 9 0 0 0-9-9Z"/>
            </svg>
                Published Materials
        </a>
    <!--LIBRARIAN-->
    <?php elseif ($role === "Librarian"): ?>
        <!-- Dashboard -->
        <a href="main.php?page=librarianDashboard"
            class="cf-nav-item <?php echo ($current === 'librarianDashboard') ? 'active' : ''; ?>">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                    stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-3 flex-shrink-0">
                <path stroke-linecap="round" stroke-linejoin="round" 
                        d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"/>
            </svg>
            Dashboard
        </a>

         <!-- Manage Materials -->
         <div>
            <button @click="openMenu = (openMenu === 'materials' ? '' : 'materials')"
                class="flex items-center justify-between w-full cf-nav-item">
                    <span class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                        stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-3 flex-shrink-0">
                        <path stroke-linecap="round" stroke-linejoin="round" 
                            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375
                                h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5
                                a3.375 3.375 0 0 0-3.375-3.375H8.25
                                m0 12.75h7.5m-7.5 3H12
                                M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125
                                v17.25c0 .621.504 1.125 1.125 1.125h12.75
                                c.621 0 1.125-.504 1.125-1.125V11.25
                                a9 9 0 0 0-9-9Z"/>
                    </svg>
                    Materials
                    </span>
                    <svg :class="{'rotate-180': openMenu === 'materials'}" 
                        class="w-4 h-4 transition-transform flex-shrink-0" 
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" 
                            stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
            </button>
                <div x-show="openMenu === 'materials'" x-collapse 
                        class="ml-6 mt-2 space-y-1">
                     <a href="main.php?page=materials" 
                        class="cf-sub-item <?php echo ($current === 'materials') ? 'active' : ''; ?>">Material Records</a>
                     <a href="main.php?page=materialType" 
                        class="cf-sub-item <?php echo ($current === 'materialType') ? 'active' : ''; ?>">Material Types</a>
                </div>
        </div>

         <!-- Borrowing Requests -->
         <a href="main.php?page=borrowing" 
            class="cf-nav-item <?php echo ($current === 'borrowing') ? 'active' : ''; ?>">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                  stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-3 flex-shrink-0">
               <path stroke-linecap="round" stroke-linejoin="round" 
                     d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
            </svg>
            Borrowing Requests
         </a>

         <!-- Submissions -->
         <a href="main.php?page=approved" 
            class="cf-nav-item <?php echo ($current === 'approved') ? 'active' : ''; ?>">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                  stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-3 flex-shrink-0">
               <path stroke-linecap="round" stroke-linejoin="round" 
                     d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
           Submissions
         </a>

         <!-- Academics -->
         <a href="main.php?page=librarianColleges" 
            class="cf-nav-item <?php echo ($current === 'librarianColleges') ? 'active' : ''; ?>">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                  stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-3 flex-shrink-0">
               <path stroke-linecap="round" stroke-linejoin="round" 
                     d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"/>
            </svg>
            Colleges
         </a>
<?php endif; ?>

      
    </nav>
  </div>

  <!-- Settings & Logout (common) -->
  <div>
  
    <a href="index.html"
       class="cf-nav-item text-red-600 mt-2">
       <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" 
            stroke="currentColor" viewBox="0 0 24 24">
         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
               d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7
                  a2 2 0 01-2-2V7a2 2 0 012-2h4
                  a2 2 0 012 2v1"/>
       </svg>
       Logout
    </a>
  </div>
</aside>

<link rel="stylesheet" href="sidebar.css">