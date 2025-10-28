<?php
  require './db.php';
  $userName = $_POST['userName'];
  $passWord = md5($_POST['passWord']);
  $numRows = 0;

  $sql1 = "CALL sp_checkLogin(?,?);";
  $conncheck=$conn->prepare($sql1);
  $conncheck->bindParam(1, $userName, PDO::PARAM_STR);
  $conncheck->bindParam(2, $passWord, PDO::PARAM_STR);
  $conncheck->execute();

  while($row = $conncheck->fetch()) 
      {
          $numRows = $row['rowcount'];

          if($numRows>0)
          {
              session_start();
              $_SESSION['user_id'] = $row['userID']; 
              $_SESSION['role'] = $row['roleName'];
              echo $row['roleName'];

          }
          else
          {
              echo "Username and password is incorrect!";
              $conncheck->connection=null;
              break;
          }
      }
          $conncheck->connection=null;





























/*$error = "";

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
        header("Location: index.php?page=deanDashboard");
        break;
      case "Student":
      case "Faculty":
        header("Location: index.php?page=student_dashboard");
        break;
      case "Dean":
        header("Location: index.php?page=deanDashboard"); // or dean_dashboard if you add one
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
}*/
?>