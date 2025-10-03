<?php
session_start();

// Hardcoded accounts for GUI testing (username => [password, role])
$accounts = [
  "sysAdmin123"  => ["password" => "sysAdmin123",  "role" => "SysAdmin"],
  "student123"   => ["password" => "student123",   "role" => "Student"],
  "faculty123"   => ["password" => "faculty123",   "role" => "Faculty"],
  "dean123"      => ["password" => "dean123",      "role" => "Dean"],
  "librarian123" => ["password" => "librarian123", "role" => "Librarian"],
];

$error = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $username = trim($_POST["username"]);
  $password = trim($_POST["password"]);

  // Check credentials
  if (isset($accounts[$username]) && $accounts[$username]["password"] === $password) {
    // Save to session
    $_SESSION["username"] = $username;
    $_SESSION["role"] = $accounts[$username]["role"];

    // Redirect based on role
    switch ($_SESSION["role"]) {
      case "SysAdmin":
        header("Location: index.php?page=dashboard");
        break;
      case "Student":
      case "Faculty":
        header("Location: index.php?page=student_dashboard");
        break;
      case "Dean":
        header("Location: index.php?page=dashboard"); // or dean_dashboard if you add one
        break;
      case "Librarian":
        header("Location: index.php?page=librarianDashboard"); // or librarian_dashboard if you add one
        break;
      default:
        header("Location: loginOne.php"); // fallback
    }
    exit;

  } else {
    // Invalid credentials
    $error = "Invalid username or password!";
  }
}
?>


<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Login to Your Account</title>
<style>
  body { 
    font-family: Arial, sans-serif; 
    background-color: #f2f2f2;
    display: flex; 
    justify-content: center; 
    align-items: center; 
    height: 100vh; 
    margin: 0; 
}
  .container { 
    background: #fff; 
    padding: 30px; 
    border-radius: 6px;
    box-shadow: 0 0 8px rgba(0,0,0,0.1); 
    width: 380px; 
}
  h2 { 
    text-align: center; 
    margin-bottom: 20px; 
}
  label { 
    display: block; 
    margin: 10px 0 5px; 
    font-weight: bold; 
}
  input { 
    width: 100%; 
    padding: 10px; 
    margin-bottom: 12px; 
    border: 1px solid #ccc;
    border-radius: 4px; 
    box-sizing: border-box; 
}
  .checkbox { 
    display: inline-flex; 
    align-items: center; 
    gap: 8px; 
    margin-bottom: 15px; 
    font-size: 14px; }
  .checkbox input[type="checkbox"] 
  { width: 13px; 
    height: 13px; 
    cursor: pointer; 
}
  .checkbox label {
     margin: 0; 
     font-weight: normal; 
     cursor: pointer; 
    }
  .forgot-password { 
    text-align: right; 
    margin-top: -10px; 
    margin-bottom: 15px; 
}
  .forgot-password a { 
    color: #059669; 
    text-decoration: none; 
    font-size: 14px; 
}
  .forgot-password a:hover { 
    text-decoration: underline; 
}
  button { 
    width: 100%; 
    padding: 12px; 
    background: #059669;
    border: none;
    border-radius: 20px; 
    color: white; 
    font-size: 16px; 
    cursor: pointer; 
}
  button:hover { 
    background: rgb(0, 73, 50); 
}
  .register-link { 
    text-align: center; 
    margin-top: 15px; 
    font-size: 14px; 
}
  .register-link a { 
    color: #059669; 
    text-decoration: none; 
}
  .register-link a:hover { 
    text-decoration: underline; 
}
  .error { 
    color: red; 
    text-align: center; 
    margin-bottom: 10px; 
    }


    
</style>
</head>
<body>
<div class="container">
  <h2>Login to Your Account</h2>

  <?php if ($error): ?>
    <div class="error"><?= htmlspecialchars($error) ?></div>
  <?php endif; ?>

  <!-- Login Form -->
  <form method="POST" action="">
    <label for="username">Username</label>
    <input type="text" id="username" name="username" placeholder="Enter your username" required>

    <label for="password">Password</label>
    <input type="password" id="password" name="password" placeholder="Enter your password" required>

    <div class="checkbox">
      <input type="checkbox" id="show-pass">
      <label for="show-pass">Show password</label>
    </div>

    <div class="forgot-password">
      <a href="forgot_password.php">Forgot password?</a>
    </div>

    <button type="submit">Login</button>
    <div class="register-link">
      Don't have an account? <a href="registrationOne.php">Register</a>
    </div>
  </form>
</div>

<script>
  const toggle = document.getElementById('show-pass');
  const password = document.getElementById('password');
  toggle.addEventListener('change', () => {
    password.type = toggle.checked ? 'text' : 'password';
  });
  document.getElementById('username').focus();
</script>
</body>
</html>
