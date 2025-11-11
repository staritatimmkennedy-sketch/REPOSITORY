<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Register an Account</title>
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

  input, select {
    width: 100%;
    padding: 10px;
    margin-bottom: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .password-container {
    display: flex;
    gap: 10px;
  }

  .password-container input {
    flex: 1;
  }

  .checkbox {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 15px;
    font-size: 14px;
    white-space: nowrap;
  }

  .row {
    display: flex;
    gap: 10px;
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

  .login-link {
    text-align: center;
    margin-top: 15px;
    font-size: 14px;
  }

  .login-link a {
    color: #059669;
    text-decoration: none;
  }

  .login-link a:hover {
    text-decoration: underline;
  }

  .error {
    color: red;
    font-size: 12px;
    margin-bottom: 10px;
  }
</style>
</head>

<body>
<div class="container">
  <h2>Create an Account</h2>
  <form id="registrationForm">
    <label>Username</label>
    <input type="text" name="username" placeholder="Type Username" required>

    <label>Password</label>
    <div class="password-container">
      <input type="password" id="pw1" name="password" placeholder="Password" required>
      <input type="password" id="pw2" placeholder="Repeat Password" required>
    </div>
    <div id="password-error" class="error"></div>

    <div class="checkbox">
      <input type="checkbox" id="show-pass"><label for="show-pass">Show password</label>
    </div>

    <label>Personal Details</label>
    <input type="text" name="lastname" placeholder="Last Name" required>
    <input type="text" name="firstname" placeholder="First Name" required>
    <input type="text" name="middlename" placeholder="Middle Name">

    <!-- Department Dropdown -->
    <label for="department">Department</label>
    <select name="department" id="department" required>
      <option value="" disabled selected>Select Department</option>
      <option value="1">College of Engineering, Architecture, and Technology</option>
      <option value="2">College of Health Sciences</option>
      <option value="3">College of Education and Sciences</option>
      <option value="4">Business College</option>
    </select>

    <!-- Course Dropdown -->
    <label for="course">Course</label>
    <select name="course" id="course" required>
      <option value="" disabled selected>Select Course</option>
      <option value="BSIT">BS Information Technology</option>
      <option value="BSA">BS Accountancy</option>
      <option value="BSEd">BS Education</option>
      <option value="BSN">BS Nursing</option>
    </select>

    <label for="yearlevel">Year Level</label>
    <select name="yearlevel" id="yearlevel" required>
      <option value="" disabled selected>Select Year Level</option>
      <option value="1st Year">1st Year</option>
      <option value="2nd Year">2nd Year</option>
      <option value="3rd Year">3rd Year</option>
      <option value="4th Year">4th Year</option>
    </select>

    <button type="submit">Register Account</button>
    <div class="login-link">Already have an account? <a href="loginOne.php">Login</a></div>
  </form>
</div>

<script>
// Toggle password visibility
document.getElementById('show-pass').addEventListener('change', function() {
  const type = this.checked ? 'text' : 'password';
  document.getElementById('pw1').type = type;
  document.getElementById('pw2').type = type;
});

// Password validation
function validatePassword() {
  const p1 = document.getElementById('pw1').value;
  const p2 = document.getElementById('pw2').value;
  const error = document.getElementById('password-error');
  if (p1 !== p2) { error.textContent = "Passwords do not match!"; return false; }
  if (p1.length < 6) { error.textContent = "Password must be at least 6 characters!"; return false; }
  error.textContent = ""; return true;
}
document.getElementById('pw1').addEventListener('input', validatePassword);
document.getElementById('pw2').addEventListener('input', validatePassword);

// Form validation
document.getElementById('registrationForm').addEventListener('submit', function(e) {
  if (!validatePassword()) { e.preventDefault(); return false; }
});
</script>
</body>
</html>
