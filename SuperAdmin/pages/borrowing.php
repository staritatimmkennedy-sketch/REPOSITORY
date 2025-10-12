<?php
// Dummy Borrowing Requests
$borrowingRequests = [
  [
    "requested_by" => "Juan Dela Cruz",
    "date_requested" => "2025-01-15",
    "title" => "Artificial Intelligence in Education",
    "type" => "Thesis",
    "author" => "Reyes, Maria",
    "description" => "Study on the impact of AI-driven tools in classroom settings.",
    "file" => "ai_in_education.pdf",
    "department" => "College of Education",
    "duration" => "7 days"
  ],
  [
    "requested_by" => "Ana Santos",
    "date_requested" => "2025-01-17",
    "title" => "Business Sustainability Models",
    "type" => "Research Paper",
    "author" => "Garcia, Jose",
    "description" => "Analysis of eco-friendly business operations in SMEs.",
    "file" => "sustainability.pdf",
    "department" => "Business College",
    "duration" => "5 days"
  ],
  [
    "requested_by" => "Mark Lopez",
    "date_requested" => "2025-01-20",
    "title" => "Cloud Security Best Practices",
    "type" => "Journal",
    "author" => "Cruz, Juan",
    "description" => "Journal article on modern security frameworks for cloud systems.",
    "file" => "cloud_security.pdf",
    "department" => "College of Engineering, Architecture and Technology",
    "duration" => "10 days"
  ]
];

// Extract unique departments for filter
$departments = array_unique(array_map(fn($r) => $r['department'], $borrowingRequests));
include 'borrowing.html'
?>