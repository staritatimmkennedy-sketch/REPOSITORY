
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
include 'materials.html';
?>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="pages/materials.js"></script>