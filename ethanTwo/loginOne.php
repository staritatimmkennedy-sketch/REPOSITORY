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
              $_SESSION['username'] = $row['username'];
              $_SESSION['role_id'] = $row['roleID'];
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

?>