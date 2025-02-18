const wheel = document.getElementById('wheel');
const spinButton = document.getElementById('spin');
const resetButton = document.getElementById('reset');
const guessInput = document.getElementById('guess-number');
const feedback = document.getElementById('feedback');
const pointsDisplay = document.getElementById('points-display');
const guessCountDisplay = document.getElementById('guess-count-display');
const resultHistoryList = document.getElementById('result-history-list');

const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const totalSegments = 37; // Numbers 0-36
let points = 100; // Starting points
let guessCount = 0; // Track the number of guesses
const maxGuesses = 10; // Maximum allowed guesses
const resultHistory = []; // Array to store results

function createWheelSegments() {
    const segmentAngle = 360 / totalSegments;

    for (let i = 0; i < totalSegments; i++) {
        const segment = document.createElement('div');
        segment.classList.add('segment');
        segment.style.transform = `rotate(${i * segmentAngle}deg)`;

        const label = document.createElement('span');
        label.textContent = i;
        label.style.color = i === 0 ? 'green' : redNumbers.includes(i) ? 'red' : 'black';
        segment.appendChild(label);

        wheel.appendChild(segment);
    }
}

function updateLeaderboard(playerId, gameId, score) {
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
            console.log('Leaderboard updated successfully!');
        } else {
            console.error('Failed to update leaderboard:', data.error || 'Unknown error');
        }
    })
    .catch(error => {
        console.error('Error updating leaderboard:', error);
    });
}

// Utility Functions
function updatePointsDisplay() {
    pointsDisplay.textContent = `Points: ${points}`;
}

function updateGuessCountDisplay() {
    guessCountDisplay.textContent = `Guesses Made: ${guessCount} / ${maxGuesses}`;
}

// End Game Function
function endGame(message) {
    feedback.textContent = message;
    spinButton.disabled = true;
    guessInput.disabled = true;

    // Create overlay to show end message
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.zIndex = '1000';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';

    // Create modal
    const modal = document.createElement('div');
    modal.style.backgroundColor = 'white';
    modal.style.padding = '20px';
    modal.style.borderRadius = '10px';
    modal.style.textAlign = 'center';

    // Add the message to the modal
    const messageText = document.createElement('p');
    messageText.textContent = message;
    modal.appendChild(messageText);

    // Add a "Go to Main Page" button
    const button = document.createElement('button');
    button.textContent = 'Go to Main Page';
    button.style.padding = '10px 20px';
    button.style.marginTop = '20px';
    button.style.fontSize = '16px';
    button.style.backgroundColor = '#006400';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    // Redirect to the main page when the button is clicked
    button.addEventListener('click', () => {
        window.location.href = 'index.html'; // Change 'index.html' to your actual main page URL
    });

    modal.appendChild(button);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Update leaderboard at the end of the game
    const playerId = localStorage.getItem('playerId'); // Get playerId from localStorage
    const gameId = 8; // Replace with the actual ID for roulette in your database
    updateLeaderboard(playerId, gameId, points);
}

function updateResultHistory(number, color) {
    resultHistory.unshift({ number, color });

    if (resultHistory.length > 10) {
        resultHistory.pop();
    }

    resultHistoryList.innerHTML = '';
    resultHistory.forEach((result) => {
        const listItem = document.createElement('li');
        listItem.textContent = result.number;
        listItem.classList.add(result.color);
        resultHistoryList.appendChild(listItem);
    });
}

resetButton.addEventListener('click', () => {
    wheel.style.transition = 'none';
    wheel.style.transform = 'rotate(0deg)';

    spinButton.disabled = false;
    guessInput.disabled = false;

    feedback.textContent = '';
    resetButton.disabled = true;
});

spinButton.addEventListener('click', () => {
    if (guessCount >= maxGuesses) {
        feedback.textContent = 'Game Over! You have used all your guesses.';
        return;
    }

    const guessedNumber = parseInt(guessInput.value);

    // Validate guess
    if (isNaN(guessedNumber) || guessedNumber < 0 || guessedNumber >= totalSegments) {
        feedback.textContent = 'Please enter a valid number between 0 and 36.';
        guessInput.value = ''; // Clear the input box
        return;
    }

    guessCount++; // Increment guess count
    updateGuessCountDisplay(); // Update the guess count display

    const wager = 10; // Fixed wager per spin
    if (points < wager) {
        feedback.textContent = 'You do not have enough points to continue.';
        guessInput.value = ''; // Clear the input box
        return;
    }

    points -= wager; // Deduct wager points
    updatePointsDisplay();

    feedback.textContent = '';

    const randomDegree = Math.floor(Math.random() * 360) + 3600; // Minimum 10 full rotations
    const resultIndex = Math.floor(((randomDegree % 360) / (360 / totalSegments)) % totalSegments);

    wheel.style.transition = 'transform 4s ease-out';
    wheel.style.transform = `rotate(${randomDegree}deg)`; 

    setTimeout(() => {
        const number = resultIndex;
        const color = number === 0 ? 'green' : redNumbers.includes(number) ? 'red' : 'black';

        if (guessedNumber === number) {
            feedback.textContent = '🎉 Correct! You guessed the right number. You earn 50 points!';
            points += 50; // Award points for a correct guess
        } else {
            feedback.textContent = `❌ Wrong! The result was ${number}.`;
        }

        updatePointsDisplay();
        updateResultHistory(number, color);

        guessInput.value = ''; // Clear the input box after feedback

        if (guessCount >= maxGuesses) {
            endGame('Game Over! You have used all your guesses.');
        } else {
            resetButton.disabled = false; // Enable the reset button for the next spin
        }
    }, 4000);

    // Disable the spin button and guess input during spin
    spinButton.disabled = true;
    guessInput.disabled = true;
});

document.addEventListener('DOMContentLoaded', () => {
    createWheelSegments();
    updatePointsDisplay();
    updateGuessCountDisplay();
});
