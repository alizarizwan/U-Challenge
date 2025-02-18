const gameLinks = {
    Trivia: [
        { name: "Pop-Culture Trivia", url: "pop.html" },
        { name: "Sports Trivia", url: "sport.html" },
        { name: "STEM Trivia", url: "stem.html" },
        { name: "General Knowledge Trivia", url: "GK.html" },
        { name: "History Trivia", url: "history.html" },
    ],
    Games: [
        { name: "Snake", url: "snake.html" },
        { name: "Tic-Tac-Toe", url: "tictactoe.html" },
        { name: "Hangman", url: "hangman2.html" },
        { name: "Ping-Pong", url: "pong.html" },
        { name: "Space Invaders", url: "SpaceInvaders.html" },
        { name: "Cookie Clicker", url: "CookieClicker.html" },
    ],
    SpinBetWin: [
        { name: "Black-Jack", url: "blackjack.html" },
        { name: "Roulette", url: "MysteryRoulette.html" },
        { name: "Higher or Lower", url: "higherlower.html" },
    ],
};

function openCategory(category) {
    // Check if the user is registered by looking for the playerId in localStorage
    if (!localStorage.getItem('playerId')) {
        // Show registration form if the user is not registered
        document.getElementById('form-popup').style.display = 'block';
        return; // Prevent the popup from opening
    }

    // User is registered, proceed to show the game links popup
    const popup = document.getElementById('links-popup');
    const buttonsContainer = document.getElementById('game-buttons');
    buttonsContainer.innerHTML = ''; // Clear existing buttons

    // Populate the buttons based on the category
    gameLinks[category].forEach(game => {
        const button = document.createElement('button');
        button.textContent = game.name;
        button.onclick = function () {
            window.location.href = game.url; // Redirect to the game page
        };
        buttonsContainer.appendChild(button);
    });

    popup.style.display = 'block';
}

function closePopup(popupId) {
    document.getElementById(popupId).style.display = 'none';
}

// Ensure the registration form appears on reload
window.onload = function () {
    const playerId = localStorage.getItem('playerId');
    const registrationTime = localStorage.getItem('registrationTime');
    const threeHours = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

    if (!playerId || !registrationTime || (Date.now() - registrationTime > threeHours)) {
        alert('Your session has expired. Please register again.');
        // Show registration form if no playerId or registration has expired
        document.getElementById('form-popup').style.display = 'block';

        // Clear outdated registration data
        localStorage.removeItem('playerId');
        localStorage.removeItem('registrationTime');
    } else {
        console.log('Player already registered with ID:', playerId);
        document.getElementById('form-popup').style.display = 'none';
    }
};

function registerPlayer(event) {
    event.preventDefault();

    const playerName = document.getElementById('player-name').value;
    const universityId = document.getElementById('university').value;

    if (!playerName || !universityId) {
        alert('Please fill in all fields.');
        return;
    }

    console.log('Sending registration data:', { name: playerName, university_id: universityId });

    fetch('register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: playerName, university_id: universityId }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Registration response:', data);
        if (data.success) {
            const playerId = data.playerId;
            const registrationTime = Date.now();

            // Store player ID and registration time
            localStorage.setItem('playerId', playerId);
            localStorage.setItem('registrationTime', registrationTime);

            alert('Registration successful!');
            document.getElementById('form-popup').style.display = 'none';
        } else {
            alert('Registration failed: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error during registration:', error);
        alert('Failed to connect to the server.');
    });
}

function populateUniversities() {
    fetch('get_universities.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch universities');
            }
            return response.json();
        })
        .then(data => {
            const universitySelect = document.getElementById('university');
            universitySelect.innerHTML = '<option value="">Select Your University</option>'; // Clear existing options

            data.forEach(university => {
                const option = document.createElement('option');
                option.value = university.id; // Use university ID as the value
                option.textContent = university.name; // Display university name
                universitySelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error populating universities:', error));
}

// Populate universities when the page loads
document.addEventListener('DOMContentLoaded', populateUniversities);

function updateUniversityLeaderboard() {
    fetch('get_university_leaderboard.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched University Leaderboard Data:', data); // Debugging log

            const universityTableBody = document.querySelector('#university-leaderboard tbody');
            universityTableBody.innerHTML = ''; // Clear existing rows

            data.forEach(university => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${university.university_name || 'N/A'}</td>
                    <td>${university.total_players || 0}</td>
                    <td>${university.total_score || 0}</td>
                `;
                universityTableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching university leaderboard:', error);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    // Fetch Player Leaderboard
    fetch('get_player_leaderboard.php')
        .then(response => response.json())
        .then(data => {
            const playerTableBody = document.querySelector('#player-leaderboard tbody');
            playerTableBody.innerHTML = ''; // Clear any existing rows

            data.forEach(player => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${player.name}</td>
                    <td>${player.game}</td>
                    <td>${player.bestScore}</td>
                `;
                playerTableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching player leaderboard:', error));

    // Fetch University Leaderboard
    fetch('get_university_leaderboard.php')
        .then(response => response.json())
        .then(data => {
            const universityTableBody = document.querySelector('#university-leaderboard tbody');
            universityTableBody.innerHTML = ''; // Clear any existing rows

            data.forEach(university => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${university.name}</td>
                    <td>${university.totalPlayers}</td>
                    <td>${university.totalScore}</td>
                `;
                universityTableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching university leaderboard:', error));
});

// Populate universities when the page loads
document.addEventListener('DOMContentLoaded', populateUniversities);
document.addEventListener('DOMContentLoaded', updateUniversityLeaderboard);

// Show the feedback popup
document.getElementById('feedback-button').addEventListener('click', () => {
    document.getElementById('feedback-popup').style.display = 'block';
});

// Submit feedback
function submitFeedback(event) {
    event.preventDefault();
    const feedbackText = document.getElementById('feedback-text').value;

    if (!feedbackText.trim()) {
        alert('Please provide your feedback.');
        return;
    }

    console.log('Submitting feedback:', feedbackText);

    // Simulate sending feedback to the server
    fetch('submit_feedback.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback: feedbackText }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        alert('Thank you for your feedback!');
        document.getElementById('feedback-popup').style.display = 'none';
        document.getElementById('feedback-form').reset();
    })
    .catch(error => {
        console.error('Error submitting feedback:', error);
        alert('Failed to submit feedback. Please try again.');
    });
}
