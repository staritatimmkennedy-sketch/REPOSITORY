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
         x-data="{ openMenu: '<?php 
           echo in_array($current, ['users','role']) ? 'people' : 
                (in_array($current, ['materials','materialType']) ? 'materials' : 
                (in_array($current, ['college','course']) ? 'acad' : '')); ?>' }">

      <div class="text-gray-500 uppercase text-xs font-bold mb-2">System</div>

    <!--SYS ADMIN-->
    <?php if ($role === "Admin"): ?>
        <!-- Dashboard -->
        <a href="index.php?page=deanDashboard"
           class="cf-nav-item <?php echo ($current === 'deanDashboard') ? 'active' : ''; ?>">
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
          <div x-show="openMenu === 'people'" x-collapse x-transition.opacity 
               class="ml-6 mt-2 space-y-1">
            <a href="index.php?page=users" 
               class="cf-sub-item <?php echo ($current === 'users') ? 'active' : ''; ?>">Users</a>
            <a href="index.php?page=role" 
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
          <div x-show="openMenu === 'materials'" x-collapse x-transition.opacity 
               class="ml-6 mt-2 space-y-1">
            <a href="index.php?page=materials" 
               class="cf-sub-item <?php echo ($current === 'materials') ? 'active' : ''; ?>">Material Records</a>
            <a href="index.php?page=materialType" 
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
          <div x-show="openMenu === 'acad'" x-collapse x-transition.opacity 
               class="ml-6 mt-2 space-y-1">
            <a href="index.php?page=college" 
               class="cf-sub-item <?php echo ($current === 'college') ? 'active' : ''; ?>">Colleges</a>
            <a href="index.php?page=course" 
               class="cf-sub-item <?php echo ($current === 'course') ? 'active' : ''; ?>">Courses</a>
          </div>
        </div>

        <!-- Audit Logs -->
        <a href="index.php?page=logs" 
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
        <a href="index.php?page=student_dashboard"
            class="cf-nav-item <?php echo ($current === 'student_dashboard') ? 'active' : ''; ?>">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                  stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-3 flex-shrink-0">
               <path stroke-linecap="round" stroke-linejoin="round" 
                     d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"/>
            </svg>
            Dashboard
        </a>

        <!-- Submissions -->
        <a href="index.php?page=submissions" 
            class="cf-nav-item <?php echo ($current === 'submissions') ? 'active' : ''; ?>">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                  stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-3 flex-shrink-0">
               <path stroke-linecap="round" stroke-linejoin="round" 
                     d="M12 20h9M12 4H3m9 16V4m0 16a4 4 0 0 0 4-4h-8
                        a4 4 0 0 0 4 4z"/>
            </svg>
           Submissions
        </a>

        <!-- Borrowed Materials -->
        <a href="index.php?page=userBorrowedMaterials" 
            class="cf-nav-item <?php echo ($current === 'borrowed') ? 'active' : ''; ?>">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                  stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-3 flex-shrink-0">
               <path stroke-linecap="round" stroke-linejoin="round" 
                     d="M3 5h18M9 3v2m6-2v2M4 9h16v10a2 2 0 0 1-2 2H6
                        a2 2 0 0 1-2-2V9z"/>
            </svg>
            Borrowed Materials
        </a>

        <!-- Published Materials -->
        <a href="index.php?page=published" 
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
        <a href="index.php?page=deanDashboard"
            class="cf-nav-item <?php echo ($current === 'deanDashboard') ? 'active' : ''; ?>">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-3 flex-shrink-0">
                <path stroke-linecap="round" stroke-linejoin="round" 
                    d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"/>
            </svg>
            Dashboard
        </a>


        <!-- Submissions -->
        <a href="index.php?page=deanSubmissions"
            class="cf-nav-item <?php echo ($current === 'deanSubmissions') ? 'active' : ''; ?>">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-3 flex-shrink-0">
                <path stroke-linecap="round" stroke-linejoin="round" 
                    d="M3 5.25h18M3 12h18M3 18.75h18"/>
            </svg>
            Submissions
        </a>

        <!-- Published Materials -->
        <a href="index.php?page=published" 
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
        <a href="index.php?page=librarianDashboard"
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
                <div x-show="openMenu === 'materials'" x-collapse x-transition.opacity 
                        class="ml-6 mt-2 space-y-1">
                     <a href="index.php?page=materials" 
                        class="cf-sub-item <?php echo ($current === 'materials') ? 'active' : ''; ?>">Material Records</a>
                     <a href="index.php?page=materialType" 
                        class="cf-sub-item <?php echo ($current === 'materialType') ? 'active' : ''; ?>">Material Types</a>
                </div>
        </div>

         <!-- Borrowing Requests -->
         <a href="index.php?page=borrowing" 
            class="cf-nav-item <?php echo ($current === 'borrowing') ? 'active' : ''; ?>">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                  stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-3 flex-shrink-0">
               <path stroke-linecap="round" stroke-linejoin="round" 
                     d="M3 7h18M3 12h18M3 17h18"/>
            </svg>
            Borrowing Requests
         </a>

         <!-- Submissions -->
         <a href="index.php?page=approved" 
            class="cf-nav-item <?php echo ($current === 'approved') ? 'active' : ''; ?>">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                  stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-3 flex-shrink-0">
               <path stroke-linecap="round" stroke-linejoin="round" 
                     d="M12 20h9M12 4h9M3 4h.01M3 12h18M3 20h.01"/>
            </svg>
           Submissions
         </a>



         <!-- Academics -->
         <a href="index.php?page=librarianColleges" 
            class="cf-nav-item <?php echo ($current === 'librarianColleges') ? 'active' : ''; ?>">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                  stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-3 flex-shrink-0">
               <path stroke-linecap="round" stroke-linejoin="round" 
                     d="M12 6.75V4.5m0 2.25v2.25m0 9v2.25m0-2.25V12m-7.5 0h15"/>
            </svg>
            Colleges
         </a>
<?php endif; ?>

      
    </nav>
  </div>

  <!-- Settings & Logout (common) -->
  <div>
    <a href="index.php?page=globalSettings"
       class="cf-nav-item <?php echo ($current === 'globalSettings') ? 'active' : ''; ?>">
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" 
            stroke="currentColor" stroke-width="1.5" class="w-5 h-5 mr-3 flex-shrink-0">
         <path stroke-linecap="round" stroke-linejoin="round" 
               d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0
                  a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826
                  2.37 2.37a1.724 1.724 0 001.065 2.572
                  c1.756.426 1.756 2.924 0 3.35
                  a1.724 1.724 0 00-1.066 2.573
                  c.94 1.543-.826 3.31-2.37 2.37
                  a1.724 1.724 0 00-2.572 1.065
                  c-.426 1.756-2.924 1.756-3.35 0
                  a1.724 1.724 0 00-2.573-1.066
                  c-1.543.94-3.31-.826-2.37-2.37
                  a1.724 1.724 0 00-1.065-2.572
                  c-1.756-.426-1.756-2.924 0-3.35
                  a1.724 1.724 0 001.066-2.573
                  c-.94-1.543.826-3.31 2.37-2.37
                  .996.608 2.296.07 2.572-1.065z"/>
         <path stroke-linecap="round" stroke-linejoin="round" 
               d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
       </svg>
       Settings
    </a>
    <a href="loginOne.html"
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

<!-- Alpine.js -->
<script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js" defer></script>
<link rel = "stylesheet" href="sidebar.css">