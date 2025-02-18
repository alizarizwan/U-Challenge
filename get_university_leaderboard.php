<?php
require 'db_connection.php';

$query = "
    SELECT 
        u.name AS university_name, 
        COUNT(DISTINCT p.id) AS total_players, 
        SUM(ps.score) AS total_score
    FROM universities u
    JOIN players p ON u.id = p.university_id
    JOIN player_scores ps ON p.id = ps.player_id
    GROUP BY u.id
    ORDER BY total_score DESC
";
$result = $conn->query($query);

$universityLeaderboard = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $universityLeaderboard[] = [
            "university_name" => $row["university_name"],
            "total_players" => $row["total_players"],
            "total_score" => $row["total_score"],
        ];
    }
}

header('Content-Type: application/json');
echo json_encode($universityLeaderboard);
?>
