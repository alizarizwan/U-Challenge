let cookies = 0;
let points = 0;
const statusElement = document.getElementById("status");
const counterElement = document.getElementById("counter");
const cookieButton = document.getElementById("cookie-btn");
const quitButton = document.getElementById("quit-btn");
const popup = document.getElementById("end-popup");
const finalPointsElement = document.getElementById("final-points");

const statusTiers = [
    { threshold: 100, name: "Baker" },
    { threshold: 1000, name: "Master Chef" },
    { threshold: 10000, name: "Cookie King/Queen" },
    { threshold: 100000, name: "Ultimate Cookie Overlord" },
];

const finalThreshold = 100000;

// Update cookie count and check status
function updateCookies() {
    cookies++;
    counterElement.textContent = `Cookies: ${cookies}`;
    updateStatus();
    checkPoints();
}

// Update user status based on cookies
function updateStatus() {
    let newStatus = "Granny";
    for (let tier of statusTiers) {
        if (cookies >= tier.threshold) {
            newStatus = tier.name;
        } else {
            break;
        }
    }
    statusElement.textContent = `Status: ${newStatus}`;
}

// Check and update points
function checkPoints() {
    if (cookies % 100 === 0) {
        points++;
    }
    if (cookies >= finalThreshold) {
        endGame("Congratulations! You reached the final threshold!");
    }
}

// End the game and show popup
function endGame(message) {
    updateDatabase(points); // Update the database when the game ends
    popup.classList.remove("hidden");
    finalPointsElement.textContent = `${message} You scored: ${points} points!`;
}

// Quit the game and show popup
function quitGame() {
    updateDatabase(points); // Update the database when the player quits
    endGame("You chose to quit the game.");
}

// Update player's score in the database
function updateDatabase(points) {
    const playerId = localStorage.getItem("playerId");
    const gameId = 13; // Replace with the actual ID for the Cookie Clicker game

    if (playerId) {
        fetch("update_score.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ playerId, gameId, score: points }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (!data.success) {
                    console.error("Failed to update score:", data.error);
                } else {
                    console.log("Score updated successfully!");
                }
            })
            .catch((error) => {
                console.error("Error updating score:", error);
            });
    } else {
        console.error("Player ID is missing. Ensure the player is registered.");
    }
}

// Event listeners
cookieButton.addEventListener("click", updateCookies);
quitButton.addEventListener("click", quitGame);
