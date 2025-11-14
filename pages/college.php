<?php
// pages/college.php

require_once __DIR__ . '/../db.php';

// Use $conn as defined in your db.php
if (!isset($conn) || !($conn instanceof PDO)) {
    // Optional: fallback to dummy data if DB fails (like your original)
    $colleges = [
        ["id" => "1", "name" => "College of Engineering, Architecture and Technology"],
        ["id" => "2", "name" => "College of Health Sciences"],
        ["id" => "3", "name" => "College of Arts and Science"],
        ["id" => "4", "name" => "Business College"],
        ["id" => "5", "name" => "College of Education"]
    ];
} else {
    try {
        // Fetch real colleges from DB
        $stmt = $conn->query("SELECT college_id AS id, collegeName AS name FROM college ORDER BY college_id ASC");
        $colleges = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // If no colleges found, use dummy data as fallback
        if (empty($colleges)) {
            $colleges = [
                ["id" => "1", "name" => "College of Engineering, Architecture and Technology"],
                ["id" => "2", "name" => "College of Health Sciences"],
                ["id" => "3", "name" => "College of Arts and Science"],
                ["id" => "4", "name" => "Business College"],
                ["id" => "5", "name" => "College of Education"]
            ];
        }
    } catch (PDOException $e) {
        error_log("College fetch error: " . $e->getMessage());
        // Fallback to dummy data on query error
        $colleges = [
            ["id" => "1", "name" => "College of Engineering, Architecture and Technology"],
            ["id" => "2", "name" => "College of Health Sciences"],
            ["id" => "3", "name" => "College of Arts and Science"],
            ["id" => "4", "name" => "Business College"],
            ["id" => "5", "name" => "College of Education"]
        ];
    }
}

include 'college.html';
?>