// STEM Trivia Questions
const questions = [
  {
    question: "What does DNA stand for?",
    options: ["Deoxyribonucleic Acid", "Dynamic Nucleic Acid", "Dual Nucleotide Array", "Direct Neutron Analysis"],
    answer: 0
  },
  {
    question: "What is the speed of light in a vacuum?",
    options: ["186,000 miles per second", "150,000 miles per second", "200,000 miles per second", "250,000 miles per second"],
    answer: 0
  },
  {
    question: "Which planet is known as the 'Red Planet'?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    answer: 1
  },
  {
    question: "Who is considered the father of modern physics?",
    options: ["Galileo Galilei", "Isaac Newton", "Albert Einstein", "Nikola Tesla"],
    answer: 2
  },
  {
    question: "What is the unit of electric current?",
    options: ["Volt", "Ohm", "Ampere", "Watt"],
    answer: 2
  },
  {
    question: "Which chemical element has the symbol 'O'?",
    options: ["Oxygen", "Osmium", "Oganesson", "Opalium"],
    answer: 0
  },
  {
    question: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Ribosome", "Mitochondria", "Cytoplasm"],
    answer: 2
  },
  {
    question: "What is the study of earthquakes called?",
    options: ["Volcanology", "Seismology", "Geology", "Meteorology"],
    answer: 1
  },
  {
    question: "Which programming language is widely used for Artificial Intelligence (AI) development?",
    options: ["Python", "JavaScript", "C++", "PHP"],
    answer: 0
  },
  {
    question: "What does the Hubble Space Telescope primarily observe?",
    options: ["Gamma Rays", "Visible Light", "Infrared Radiation", "X-rays"],
    answer: 1
  },
  {
    question: "What does 'HTTP' stand for in computing?",
    options: ["HyperText Transfer Protocol", "Hyperlink Transmission Process", "HyperText Transfer Process", "High Transfer Text Protocol"],
    answer: 0
  },
  {
    question: "Which law of motion states that for every action, there is an equal and opposite reaction?",
    options: ["Newton's First Law", "Newton's Second Law", "Law of Universal Gravitation", "Newton's Third Law"],
    answer: 3
  },
  {
    question: "What is the largest organ in the human body?",
    options: ["Liver", "Skin", "Brain", "Heart"],
    answer: 1
  },
  {
    question: "Which element is the most abundant in the Earth's atmosphere?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    answer: 1
  },
  {
    question: "What is the term for animals that only eat plants?",
    options: ["Carnivores", "Herbivores", "Omnivores", "Detritivores"],
    answer: 1
  },
  {
    question: "What does a vector in physics represent?",
    options: ["Magnitude only", "Direction only", "Magnitude and direction", "Force and pressure"],
    answer: 2
  },
  {
    question: "What is the smallest particle of an element that retains its chemical properties?",
    options: ["Atom", "Molecule", "Proton", "Neutron"],
    answer: 0
  },
  {
    question: "What type of energy is stored in a compressed spring?",
    options: ["Kinetic Energy", "Chemical Energy", "Potential Energy", "Thermal Energy"],
    answer: 2
  },
  {
    question: "Which planet has the most moons?",
    options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
    answer: 1
  },
  {
    question: "What is the process by which plants make food using sunlight?",
    options: ["Respiration", "Photosynthesis", "Fermentation", "Transpiration"],
    answer: 1
  }
];

let currentQuestionIndex = 0;
let score = 0;

// Function to shuffle questions
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Disable options initially when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const options = document.querySelectorAll(".option");
  options.forEach((btn) => (btn.disabled = true));
});

// Start the game
function startGame() {
  score = 0;
  currentQuestionIndex = 0;
  shuffle(questions); // Shuffle the questions
  document.getElementById("score").textContent = `Score: ${score}`;
  document.getElementById("start-btn").disabled = true;
  document.getElementById("feedback").textContent = "";

  // Enable the options
  const options = document.querySelectorAll(".option");
  options.forEach((btn) => (btn.disabled = false));

  showQuestion();
}

// Display a question
function showQuestion() {
  const questionObj = questions[currentQuestionIndex];
  document.getElementById("question").textContent = questionObj.question;

  const options = document.querySelectorAll(".option");
  options.forEach((btn, index) => {
    btn.textContent = questionObj.options[index];
    btn.disabled = false;
  });
}

// Handle option selection
function selectOption(selectedIndex) {
  const questionObj = questions[currentQuestionIndex];
  const feedback = document.getElementById("feedback");

  const options = document.querySelectorAll(".option");
  options.forEach((btn) => (btn.disabled = true));

  if (selectedIndex === questionObj.answer) {
    score++;
    document.getElementById("score").textContent = `Score: ${score}`;
    feedback.textContent = "Correct!";
    feedback.style.color = "#32cd32"; // Green for correct
  } else {
    feedback.textContent = `Wrong! Correct answer: "${questionObj.options[questionObj.answer]}"`;
    feedback.style.color = "#ff0000"; // Red for wrong
  }

  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    setTimeout(() => {
      feedback.textContent = "";
      showQuestion();
    }, 2000);
  } else {
    setTimeout(endGame, 2000);
  }
}

function updatePlayerScore(playerId, gameId, score) {
    fetch('update_score.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            playerId: playerId, // The player's ID stored in localStorage
            gameId: gameId,     // The ID for this specific game
            score: score        // The final score
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


// End the game
function endGame() {
    const playerId = localStorage.getItem('playerId'); // Ensure the player is registered
    const gameId = 3; // Replace with the actual game ID for STEM Trivia

    if (playerId) {
        updatePlayerScore(playerId, gameId, score); // Update the player's score in the database
    } else {
        console.error('Player ID is missing. Ensure the player is registered.');
    }

    // Create the popup modal
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';

    // Create the modal content
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#fff';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '10px';
    modalContent.style.textAlign = 'center';
    modalContent.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    modalContent.innerHTML = `
        <h2>Game Over!</h2>
        <p>Your final score is ${score}/${questions.length}.</p>
        <button id="redirectToMainBtn" style="padding: 10px 20px; background-color: #007bff; border: none; color: white; border-radius: 5px; cursor: pointer;">Back to Main Page</button>
    `;

    // Add the button functionality
    const redirectButton = modalContent.querySelector('#redirectToMainBtn');
    redirectButton.addEventListener('click', () => {
        window.location.href = 'index.html'; // Replace with the actual URL of your main page
    });

    modal.appendChild(modalContent);

    // Append the modal to the document body
    document.body.appendChild(modal);

    // Disable the game controls
    document.getElementById("start-btn").disabled = false;
    document.getElementById("question").textContent = "Press 'Start' to play again!";
    const options = document.querySelectorAll(".option");
    options.forEach((btn) => (btn.textContent = ""));
}
