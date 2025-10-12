<?php
// Dummy materials data
$materials = [
  [
    "submitted_by" => "Justin Dhyll Mansueto",
    "title" => "AI in Education",
    "type" => "Thesis",
    "author" => "Mansueto, Justin",
    "date" => "2025-01-10",
    "desc" => "Thesis on using AI for personalized student learning.",
    "file" => "ai_education.pdf",
    "department" => "College of Education",
    "course" => "BS-IT – Bachelor of Science in Information Technology",
    "approved_by" => "Dean Garcia",
    "published_by" => "Librarian Reyes"
  ],
  [
    "submitted_by" => "Tim Kennedy Sta Rita",
    "title" => "Green Architecture Design",
    "type" => "Research Paper",
    "author" => "Sta Rita, Tim",
    "date" => "2025-01-05",
    "desc" => "Paper on sustainable and eco-friendly building practices.",
    "file" => "green_architecture.pdf",
    "department" => "College of Engineering, Architecture and Technology",
    "course" => "BS-ARCH – Bachelor of Science in Architecture",
    "approved_by" => "Dean Cruz",
    "published_by" => "Librarian Santos"
  ]
];

// Filter options
$departments = [
  "College of Engineering, Architecture and Technology",
  "College of Health Sciences",
  "College of Education",
  "Business College",
  "College of Arts and Science"
];

$courses = [
  "BS-CS – Bachelor of Science in Computer Science",
  "BS-IT – Bachelor of Science in Information Technology",
  "BS-ARCH – Bachelor of Science in Architecture",
  "BS-N – Bachelor of Science in Nursing",
  "BSED-MATHEMATICS – Bachelor of Secondary Education Major in Mathematics"
];

$types = ["Book", "Thesis", "Research Paper", "Journal"];
include 'materials.html'
?>