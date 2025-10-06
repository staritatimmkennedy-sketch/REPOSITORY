<?php
//Database details
$db_host = 'localhost';
$db_username = 'root';
$db_password = '';
$db_name = 'library_repository_db';
$dsn = "mysql:host=$db_host;dbname=$db_name;charset=UTF8";

//Create connection and select DB
try 
{
    $conn = new PDO($dsn, $db_username, $db_password);
    if ($conn) {
       // echo "Successfully connected to database";
    }
}
catch(PDOException $e)
{
    echo  "Failed to connect to MySQL: " . mysqli_connect_error();
}
?>