<?php
// Database configuration
$host = 'localhost';    // Database host (usually 'localhost')
$db = 'uchallenge';     // Database name
$user = 'root';         // Database username
$pass = '';             // Database password (leave blank if none)

// Create a connection
$conn = new mysqli($host, $user, $pass, $db);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
