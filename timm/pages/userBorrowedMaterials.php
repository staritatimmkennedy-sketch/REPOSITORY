
<?php
if (!isset($_SESSION)) {
  session_start();
}
?>
<?php 
if (!isset($_SESSION['user_id']) ||  !isset($_SESSION['role'])) {
    die("Error: User not logged in");
}
?>

<?php
echo "<div style='padding:10px; background:#f0f8ff; border:1px solid #007acc; margin-bottom: 15px;'>
        <strong>Role:</strong> " . htmlspecialchars($_SESSION['role']) . "<br>
        <strong>User ID:</strong> " . htmlspecialchars($_SESSION['user_id']) . "
      </div>";

include 'userBorrowedMaterials.html';
?>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="pages/user_borrowedMaterials.js"></script>