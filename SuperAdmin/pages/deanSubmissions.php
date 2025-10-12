<?php
// Dummy pending submissions for Dean
$pendingSubmissions = [
  [
    "title" => "AI in Education",
    "type" => "Thesis",
    "author" => "Reyes, Juan",
    "date_submitted" => "2025-01-20",
    "description" => "Explores AI integration in classrooms.",
    "file" => "ai_education.pdf",
    "department" => "College of Education",
    "status" => "Pending"
  ],
  [
    "title" => "Healthcare Robotics",
    "type" => "Research Paper",
    "author" => "Santos, Maria",
    "date_submitted" => "2025-01-22",
    "description" => "Study on robotics in patient care.",
    "file" => "healthcare_robotics.pdf",
    "department" => "College of Health Sciences",
    "status" => "Pending"
  ]
];

// Extract unique departments and material types for filters
$departments = array_unique(array_map(fn($r) => $r['department'], $pendingSubmissions));
$types = array_unique(array_map(fn($r) => $r['type'], $pendingSubmissions));
include 'deanSubmissions.html'
?>