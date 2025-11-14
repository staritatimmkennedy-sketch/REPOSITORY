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
    errorElement.classList.add('hidden'); // Hide when typing
  });

  $('#loginForm').on('submit', function(e) {
    e.preventDefault();
    
    var userName = document.getElementById("username").value.trim();
    var passWord = document.getElementById("password").value.trim();
    
    // Clear and hide error at start of submission
    errorElement.textContent = '';
    errorElement.classList.add('hidden');
    
    if(!userName || !passWord) {
      errorElement.textContent = "Please fill in all required fields";
      errorElement.classList.remove('hidden'); // Show error
      return;
    }

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
          errorElement.classList.remove('hidden'); // Show error
        }
        else {
          location.href = "./main.php?page=student_dashboard";
        }
      },
      error: function() {
        errorElement.textContent = "Login failed. Please try again.";
        errorElement.classList.remove('hidden'); // Show error
      }
    });
  }); 
});