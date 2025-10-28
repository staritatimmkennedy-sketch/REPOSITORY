<?php
// Dummy approved submissions
$approvedSubmissions = [
  [
    "title" => "Green Energy Solutions",
    "type" => "Project",
    "author" => "Lopez, Mark",
    "date_submitted" => "2025-01-12",
    "description" => "Capstone project on sustainable power systems.",
    "file" => "green_energy.pdf",
    "department" => "College of Engineering",
    "status" => "Approved"
  ],
  [
    "title" => "E-Commerce Trends",
    "type" => "Research Paper",
    "author" => "Dela Cruz, Anna",
    "date_submitted" => "2025-01-15",
    "description" => "Study on online business growth in the Philippines.",
    "file" => "ecommerce_trends.pdf",
    "department" => "Business College",
    "status" => "Approved"
  ]
];

// Extract unique filters
$departments = array_unique(array_map(fn($r) => $r['department'], $approvedSubmissions));
$types = array_unique(array_map(fn($r) => $r['type'], $approvedSubmissions));
include 'approvedDean.html'
?>