// Game initialization
let score = 0;
let tries = 5;
let currentNumber = getRandomNumber();
let nextNumber = getRandomNumber();

// Elements
const currentNumberElement = document.getElementById("current-number");
const scoreElement = document.getElementById("score");
const triesElement = document.getElementById("tries");
const higherButton = document.getElementById("higher-btn");
const lowerButton = document.getElementById("lower-btn");

// Update the current number on the screen
currentNumberElement.textContent = currentNumber;

// Generate a random number
function getRandomNumber() {
    return Math.floor(Math.random() * 100) + 1;
}

// Function to check the player's guess
function makeGuess(isHigher) {
    if (tries > 0) {
        // Generate the next random number
        nextNumber = getRandomNumber();
        const isCorrect = (isHigher && nextNumber > currentNumber) || (!isHigher && nextNumber < currentNumber);

        if (isCorrect) {
            score++;
            alert("Correct! You got a point!");
        } else {
            alert("Incorrect! No points this round.");
            tries--;
        }

        // Update the game state
        currentNumber = nextNumber;
        updateGame();
    }
}

// Update the game display
function updateGame() {
    currentNumberElement.textContent = currentNumber;
    scoreElement.textContent = `Score: ${score}`;
    triesElement.textContent = `Tries left: ${tries}`;

    if (tries === 0) {
        endGame();
    }
}

function updatePlayerScore(playerId, gameId, score) {
    fetch('update_score.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            playerId: playerId,
            gameId: gameId,
            score: score,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Score updated successfully!');
        } else {
            console.error('Failed to update score:', data.error || 'Unknown error');
        }
    })
    .catch(error => {
        console.error('Error updating score:', error);
    });
}

// End the game and display a popup
function endGame() {
    higherButton.disabled = true;
    lowerButton.disabled = true;

    // Get playerId and gameId
    const playerId = localStorage.getItem('playerId'); // Ensure the player is registered and ID is stored
    const gameId = 10; // Replace with the actual game ID for this game

    if (playerId) {
        updatePlayerScore(playerId, gameId, score); // Update the player's score in the database
    } else {
        console.error('Player ID is missing. Ensure the player is registered.');
    }

    // Create the overlay
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");

    // Create the modal
    const modal = document.createElement("div");
    modal.classList.add("modal");

    // Add the final score message
    const message = document.createElement("p");
    message.textContent = `Game Over! Final Score: ${score}`;
    modal.appendChild(message);

    // Add the "Go to Main Page" button
    const button = document.createElement("button");
    button.textContent = "Go to Main Page";
    button.style.padding = "10px 20px";
    button.style.fontSize = "16px";
    button.style.backgroundColor = "#007bff";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";

    button.addEventListener("click", () => {
        window.location.href = "index.html"; // Replace with your main page URL
    });

    modal.appendChild(button);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}


// Event listeners for the buttons
higherButton.addEventListener("click", () => makeGuess(true));
lowerButton.addEventListener("click", () => makeGuess(false));
