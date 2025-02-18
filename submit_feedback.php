<?php
// Database configuration
$host = 'localhost'; // Database host
$db = 'uchallenge'; // Your database name
$user = 'root'; // Database username
$pass = ''; // Database password

try {
    // Create a new PDO instance
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get the raw POST data
    $data = json_decode(file_get_contents('php://input'), true);

    // Check if feedback_text is provided
    if (isset($data['feedback']) && !empty(trim($data['feedback']))) {
        $feedbackText = trim($data['feedback']);

        // Prepare the SQL query
        $stmt = $pdo->prepare("INSERT INTO feedback (feedback_text) VALUES (:feedback_text)");
        $stmt->bindParam(':feedback_text', $feedbackText);

        // Execute the query
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Feedback submitted successfully.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to submit feedback.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Feedback text is required.']);
    }
} catch (PDOException $e) {
    // Return error response if database connection fails
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
