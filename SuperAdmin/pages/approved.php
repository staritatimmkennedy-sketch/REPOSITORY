<?php
// Dummy Approved Submissions
$approvedSubmissions = [
  [
    "title" => "AI in Medical Diagnosis",
    "type" => "Thesis",
    "author" => "Cruz, Juan",
    "date_submitted" => "2025-01-10",
    "description" => "A study on the use of machine learning in identifying early disease symptoms.",
    "file" => "ai_medical.pdf",
    "department" => "College of Health Sciences",
    "status" => "Approved"
  ],
  [
    "title" => "Green Architecture Design",
    "type" => "Project",
    "author" => "Reyes, Anna",
    "date_submitted" => "2025-01-14",
    "description" => "Capstone project on eco-friendly architectural designs for urban areas.",
    "file" => "green_architecture.pdf",
    "department" => "College of Engineering, Architecture and Technology",
    "status" => "Approved"
  ],
  [
    "title" => "Digital Transformation in SMEs",
    "type" => "Research Paper",
    "author" => "Santos, Mark",
    "date_submitted" => "2025-01-20",
    "description" => "Research on the impact of digital adoption among small enterprises.",
    "file" => "digital_transformation.pdf",
    "department" => "Business College",
    "status" => "Approved"
  ]
];

// Extract unique departments and material types for filters
$departments = array_unique(array_map(fn($r) => $r['department'], $approvedSubmissions));
$types = array_unique(array_map(fn($r) => $r['type'], $approvedSubmissions));
include 'approved.html'
?>