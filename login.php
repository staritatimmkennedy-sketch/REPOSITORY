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
include 'index.html';
?>
