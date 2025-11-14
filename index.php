<?php
session_start();
require './db.php';

// Only process AJAX login requests
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['userName']) && isset($_POST['passWord'])) {
    
    $userName = $_POST['userName'];
    $passWord = md5($_POST['passWord']);

    try {
        $sql1 = "CALL sp_checkLogin(?,?);";
        $conncheck = $conn->prepare($sql1);
        $conncheck->bindParam(1, $userName, PDO::PARAM_STR);
        $conncheck->bindParam(2, $passWord, PDO::PARAM_STR);
        $conncheck->execute();

        $userFound = false;
        
        while($row = $conncheck->fetch()) {
            $userFound = true;
            $numRows = $row['rowcount'];

            if($numRows > 0) {
                $_SESSION['user_id'] = $row['userID']; 
                $_SESSION['role'] = $row['roleName'];
                $_SESSION['username'] = $row['username'];
                $_SESSION['role_id'] = $row['roleID'];
                
                // Return the role name for AJAX response
                echo $row['roleName'];
                exit;
            }
        }
        
        if (!$userFound) {
            echo "Invalid username or password";
        }
        
    } catch (Exception $e) {
        error_log("Login error: " . $e->getMessage());
        echo "Login failed. Please try again.";
    }
    exit;
}

// If not a POST request, show the login page HTML
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Login to Your Account</title>
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
</head>
<body class="bg-gray-100 flex justify-center items-center min-h-screen p-4">
  <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
    <h2 class="text-xl font-bold text-center mb-4">Login to Your Account</h2>
    
    <!-- Error Display -->
    <div id="error" class="text-red-500 text-xs mb-3 text-center font-medium bg-red-50 p-2 rounded border border-red-200 hidden"></div>

    <!-- Login Form -->
    <form action="" name="login" id="loginForm">
      <div class="mb-3">
        <label for="username" class="block font-medium text-gray-700 mb-1 text-sm">Username</label>
        <input type="text" id="username" name="username" placeholder="Enter your username" 
               class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:outline-none" required>
      </div>

      <div class="mb-3">
        <label for="password" class="block font-medium text-gray-700 mb-1 text-sm">Password</label>
        <input type="password" id="password" name="password" placeholder="Enter your password" 
               class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:outline-none" required>
      </div>

      <div class="flex items-center mb-3">
        <input type="checkbox" id="show-pass" class="w-4 h-4 mr-2">
        <label for="show-pass" class="text-xs">Show password</label>
      </div>

      <button type="submit" id="btn-submit" 
              class="w-full py-2 bg-green-700 text-white rounded font-medium hover:bg-green-800 transition duration-200 mb-3 text-sm">
        Login
      </button>
      
      <div class="text-center text-xs text-gray-600">
        Don't have an account? <a href="registration.php" class="text-green-600 hover:underline">Register</a>
      </div>
    </form>
  </div>

  <script>
    $(document).ready(function(){ 
      const toggle = document.getElementById('show-pass');
      const password = document.getElementById('password');
      const errorElement = document.getElementById('error');
      
      // Hide error initially
      errorElement.classList.add('hidden');
      
      toggle.addEventListener('change', () => {
        password.type = toggle.checked ? 'text' : 'password';
      });

      // Clear error when user starts typing
      $('#username, #password').on('input', function() {
        errorElement.textContent = '';
        errorElement.classList.add('hidden');
      });

      $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        
        var userName = document.getElementById("username").value.trim();
        var passWord = document.getElementById("password").value.trim();
        var submitBtn = document.getElementById('btn-submit');
        
        // Clear and hide error at start of submission
        errorElement.textContent = '';
        errorElement.classList.add('hidden');
        
        if(!userName || !passWord) {
          errorElement.textContent = "Please fill in all required fields";
          errorElement.classList.remove('hidden');
          return;
        }

        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging in...';

        $.ajax({
          method: "POST",
          url: "index.php",
          data: {
            userName: userName,
            passWord: passWord
          },
          success: function(data) {
            if(data == "Admin") {
              location.href = "./main.php?page=adminDashboard";
            }
            else if(data == "Librarian") {
              location.href = "./main.php?page=librarianDashboard";
            }
            else if(data == "Dean") {
              location.href = "./main.php?page=deanDashboard";
            }
            else if(data == "Invalid username or password" || data == "Missing login credentials" || data == "Login failed. Please try again.") {
              errorElement.textContent = data;
              errorElement.classList.remove('hidden');
            }
            else {
              location.href = "./main.php?page=student_dashboard";
            }
          },
          error: function() {
            errorElement.textContent = "Login failed. Please try again.";
            errorElement.classList.remove('hidden');
          },
          complete: function() {
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Login';
          }
        });
      }); 
    });
  </script>
</body>
</html>