<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();
header('Content-Type: application/json');

// Simple hardcoded response for testing
$test_data = [
    [
        "materialSubmission_id" => 1,
        "studentName" => "Test Student",
        "materialName" => "Test Material", 
        "materialType_id" => "Book",
        "author" => "Test Author",
        "submissionDate" => "2024-01-15",
        "approvalDate" => null,
        "materialDescription" => "Test description",
        "materialFile" => "",
        "approvalStatus" => "Pending"
    ]
];

echo json_encode($test_data);
?>