<?php
// Dummy user data
$users = [
  [
    "first_name" => "Justin Dhyll",
    "middle_name" => "Bernal",
    "last_name" => "Mansueto",
    "department" => "College of Education",
    "course" => "BS-IT – Bachelor of Science in Information Technology",
    "role" => "Admin",
    "year" => "4th Year"
  ],
  [
    "first_name" => "Tim Kennedy",
    "middle_name" => "Dumaguing",
    "last_name" => "Sta Rita",
    "department" => "College of Engineering, Architecture and Technology",
    "course" => "BS-CS – Bachelor of Science in Computer Science",
    "role" => "Faculty",
    "year" => "2nd Year"
  ],
  [
    "first_name" => "Ethan Marc",
    "middle_name" => "Lumagod",
    "last_name" => "Lumagod",
    "department" => "College of Engineering, Architecture and Technology",
    "course" => "BS-CS – Bachelor of Science in Computer Science",
    "role" => "Student",
    "year" => "3rd Year"
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
  "BS-EMC – Bachelor of Science in Entertainment and Multimedia Computing",
  "BS-MMA – Bachelor of Science in Multi-Media Arts",
  "BS-N – Bachelor of Science in Nursing",
  "BS-MEDTECH – Bachelor of Science in Medical Technology",
  "BSED-MATHEMATICS – Bachelor of Secondary Education Major in Mathematics",
  "BPE – Bachelor of Physical Education"
];

$roles = ["Admin", "Faculty", "Student", "Dean", "Librarian"];
$years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
include 'users.html'
?>
