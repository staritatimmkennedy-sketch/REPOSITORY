<?php
// Dummy role data
$roles = [
  [
    "role_name" => "Admin",
    "description" => "Has full system access and can manage all modules."
  ],
  [
    "role_name" => "Faculty",
    "description" => "Can access academic resources and manage class-related submissions."
  ],
  [
    "role_name" => "Student",
    "description" => "Can browse, borrow, and submit academic materials."
  ],
  [
    "role_name" => "Dean",
    "description" => "Oversees academic operations and approvals."
  ],
  [
    "role_name" => "Librarian",
    "description" => "Manages repository materials and borrowing requests."
  ]
];

// Extract roles for the filter
$roleOptions = array_map(fn($r) => $r['role_name'], $roles);
include 'role.html'
?>