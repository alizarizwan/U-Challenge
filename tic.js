const cells = document.querySelectorAll('.cell');
const statusDisplay = document.querySelector('.status');
const restartButton = document.querySelector('.restart-btn');
const quitButton = document.querySelector('.quit-btn');
const quitPopup = document.getElementById('quit-popup');
const confirmQuitButton = document.getElementById('confirm-quit');
const cancelQuitButton = document.getElementById('cancel-quit');
const popupPlayerScore = document.getElementById('popup-player-score');
const popupComputerScore = document.getElementById('popup-computer-score');

let currentPlayer = 'X';
let gameActive = true;
let gameState = Array(9).fill("");
let playerScore = 0;
let computerScore = 0;

const playerScoreElement = document.getElementById('player-score');
const computerScoreElement = document.getElementById('computer-score');

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = clickedCell.getAttribute('data-index');

    if (gameState[clickedCellIndex] !== "" || !gameActive) return;

    makeMove(clickedCellIndex, 'X');

    // Add a delay for the computer's move
    if (gameActive) {
        setTimeout(() => {
            if (gameActive) computerMove();
        }, 1000); // 1-second delay
    }
}

function makeMove(index, player) {
    gameState[index] = player;
    cells[index].textContent = player;
    checkWinner();
}

function computerMove() {
    const emptyCells = gameState.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
    if (emptyCells.length > 0) {
        const move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        makeMove(move, 'O');
    }
}

function checkWinner() {
    let roundWon = false;

    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            updateScore(currentPlayer);
            break;
        }
    }

    if (roundWon) {
        statusDisplay.textContent = `${currentPlayer === 'X' ? 'Player' : 'Computer'} wins!`;
        gameActive = false;
        return;
    }

    if (!gameState.includes("")) {
        statusDisplay.textContent = "It's a draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = `${currentPlayer === 'X' ? 'Player' : 'Computer'}'s turn`;
}

function updateScore(winner) {
    if (winner === 'X') {
        playerScore++;
        playerScoreElement.textContent = playerScore;
    } else {
        computerScore++;
        computerScoreElement.textContent = computerScore;
    }
}

function restartGame() {
    currentPlayer = 'X';
    gameActive = true;
    gameState = Array(9).fill("");
    statusDisplay.textContent = "Player's turn";
    cells.forEach(cell => (cell.textContent = ""));
}

// Quit functionality
quitButton.addEventListener('click', () => {
    // Show the quit popup and update scores
    popupPlayerScore.textContent = playerScore;
    popupComputerScore.textContent = computerScore;
    quitPopup.classList.remove('hidden');
});

confirmQuitButton.addEventListener('click', () => {
    // Update the database before quitting
    updatePlayerScore(playerScore);

    // Redirect to the main page
    window.location.href = "index.html"; // Replace with the actual main page URL
});

cancelQuitButton.addEventListener('click', () => {
    // Hide the quit popup
    quitPopup.classList.add('hidden');
});

// Update player score in the database
function updatePlayerScore(score) {
    const playerId = localStorage.getItem("playerId");
    const gameId = 6; // Replace with the game ID for Tic Tac Toe

    if (playerId) {
        fetch("update_score.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                playerId,
                gameId,
                score
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    console.error("Failed to update score:", data.error);
                } else {
                    console.log("Score updated successfully!");
                }
            })
            .catch(error => console.error("Error updating score:", error));
    } else {
        console.error("Player ID is missing. Ensure the player is registered.");
    }
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);

statusDisplay.textContent = "Player's turn";

