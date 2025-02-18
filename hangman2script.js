// Game Data
const wordsList = ["javascript", "developer", "interactive", "programming", "hangman", "algorithm"];
const hangmanStages = [
    `       
       +---+
           |
           |
           |
           |
           |
    =========`,
    `       
       +---+
       |   |
       O   |
           |
           |
           |
    =========`,
    `       
       +---+
       |   |
       O   |
       |   |
           |
           |
    =========`,
    `       
       +---+
       |   |
       O   |
      /|   |
           |
           |
    =========`,
    `       
       +---+
       |   |
       O   |
      /|\\  |
           |
           |
    =========`,
    `       
       +---+
       |   |
       O   |
      /|\\  |
      /    |
           |
    =========`,
    `       
       +---+
       |   |
       O   |
      /|\\  |
      / \\  |
           |
    =========`
];

// Game State Variables
let remainingWords = [...wordsList];
let chosenWord = "";
let guessedWord = [];
let points = 0;
let mistakes = 0;
let correctLetters = [];
let wrongLetters = [];

// DOM Elements
const hangmanDrawing = document.getElementById("hangman-drawing");
const wordDisplay = document.getElementById("word-display");
const alphabetButtons = document.getElementById("alphabet-buttons");
const pointsDisplay = document.getElementById("points");
const correctLettersDisplay = document.getElementById("correct-letters");
const wrongLettersDisplay = document.getElementById("wrong-letters");
const newWordButton = document.getElementById("new-word-button");
const quitButton = document.getElementById("quit-button");
const wordMessage = document.getElementById("word-message");

// Initialize Game
function startGame() {
    if (remainingWords.length === 0) {
        endGame("Congratulations! You've completed all the words.");
        return;
    }

    chosenWord = remainingWords.splice(Math.floor(Math.random() * remainingWords.length), 1)[0];
    guessedWord = Array(chosenWord.length).fill("_");
    mistakes = 0;
    correctLetters = [];
    wrongLetters = [];
    wordMessage.innerText = ""; // Clear any previous message
    updateDisplay();
    createAlphabetButtons();
}

// Update Display
function updateDisplay() {
    hangmanDrawing.innerText = hangmanStages[mistakes];
    wordDisplay.innerText = guessedWord.join(" ");
    pointsDisplay.innerText = `Points: ${points}`;
    correctLettersDisplay.innerText = correctLetters.join(", ");
    wrongLettersDisplay.innerText = wrongLetters.join(", ");
}

// Create Alphabet Buttons
function createAlphabetButtons() {
    alphabetButtons.innerHTML = "";
    for (let i = 65; i <= 90; i++) {
        const button = document.createElement("button");
        button.classList.add("letter-btn");
        button.innerText = String.fromCharCode(i);
        button.addEventListener("click", handleGuess);
        alphabetButtons.appendChild(button);
    }
}

// Handle Letter Guess
function handleGuess(event) {
    const letter = event.target.innerText.toLowerCase();
    event.target.disabled = true;

    if (chosenWord.includes(letter)) {
        points += 10;
        correctLetters.push(letter);
        for (let i = 0; i < chosenWord.length; i++) {
            if (chosenWord[i] === letter) {
                guessedWord[i] = letter;
            }
        }
    } else {
        mistakes++;
        wrongLetters.push(letter);
    }

    updateDisplay();
    checkGameStatus();
}

// Check Game Status
function checkGameStatus() {
    if (guessedWord.join("") === chosenWord) {
        points += 10;
        wordMessage.innerText = "Great job! You guessed the word!";
        wordMessage.classList.add("visible");
        setTimeout(() => {
            wordMessage.classList.remove("visible");
            startGame();
        }, 2000);
    } else if (mistakes === hangmanStages.length - 1) {
        wordMessage.innerHTML = `Sorry! The word was: <span style="color: #ff00ff; font-weight: bold;">${chosenWord.toUpperCase()}</span>.`;
        wordMessage.classList.add("visible");

        setTimeout(() => {
            wordMessage.classList.remove("visible");
            if (remainingWords.length > 0) {
                startGame();
            } else {
                endGame("Game Over! You've gone through all the words.");
            }
        }, 3000);
    }
}

// Quit Game
function quitGame() {
    updateDatabase(points);
    showPopup("You quit the game. Thanks for playing!");
}

// End Game
function endGame(message) {
    updateDatabase(points);
    showPopup(message);
}

// Show Popup
function showPopup(message) {
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "1000";

    const modalContent = document.createElement("div");
    modalContent.style.backgroundColor = "#1e0033";
    modalContent.style.padding = "20px";
    modalContent.style.borderRadius = "10px";
    modalContent.style.textAlign = "center";
    modalContent.style.color = "#fff";
    modalContent.style.boxShadow = "0 0 20px #9933ff";

    modalContent.innerHTML = `
        <h2>${message}</h2>
        <p>Your final score is ${points} points.</p>
        <button id="redirectButton" style="padding: 10px 20px; background: linear-gradient(45deg, #800080, #3333ff); color: white; border: none; border-radius: 5px; cursor: pointer;">Back to Main Page</button>
    `;

    const redirectButton = modalContent.querySelector("#redirectButton");
    redirectButton.addEventListener("click", () => {
        window.location.href = "index.html"; // Replace with your main page URL
    });

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

// Update Player Score in Database
function updateDatabase(points) {
    const playerId = localStorage.getItem("playerId");
    const gameId = 9; // Replace with the Hangman game ID

    if (playerId) {
        console.log("Sending data to database:", { playerId, gameId, score: points });
        fetch("update_score.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ playerId, gameId, score: points }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Response from server:", data);
                if (!data.success) {
                    console.error("Failed to update score:", data.error);
                }
            })
            .catch((error) => console.error("Error updating score:", error));
    } else {
        console.error("Player ID is missing. Ensure the player is registered.");
    }
}


// Event Listeners
newWordButton.addEventListener("click", startGame);
quitButton.addEventListener("click", quitGame);

// Start the game for the first time
startGame();
