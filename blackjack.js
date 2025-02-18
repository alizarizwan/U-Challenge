const suits = ["♥", "♦", "♣", "♠"];
const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
let deck = [];
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;
let balance = 100;
let bet = 10;
let playerWins = 0;
let dealerWins = 0;

// Modal Elements
const modal = document.getElementById("game-over-modal");
const returnHomeButton = document.getElementById("return-home");

// Create and shuffle deck
function createDeck() {
  deck = [];
  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push({ suit, rank });
    }
  }
  deck.sort(() => Math.random() - 0.5); // Shuffle deck
}

// Check and reshuffle the deck if needed
function checkDeck() {
  if (deck.length < 10) {
    createDeck();
  }
}

// Calculate hand value
function calculateScore(hand) {
  let score = 0;
  let aces = 0;

  for (let card of hand) {
    if (["J", "Q", "K"].includes(card.rank)) {
      score += 10;
    } else if (card.rank === "A") {
      score += 11;
      aces++;
    } else {
      score += parseInt(card.rank);
    }
  }

  while (score > 21 && aces) {
    score -= 10;
    aces--;
  }

  return score;
}

// Display cards
function displayCards(hand, container, hideSecondCard = false) {
  container.innerHTML = "";
  hand.forEach((card, index) => {
    const cardElem = document.createElement("div");
    cardElem.className = "card";
    if (hideSecondCard && index === 1) {
      cardElem.innerHTML = "Hidden";
    } else {
      cardElem.innerHTML = `
        <span class="top-left">${card.rank}${card.suit}</span>
        <span class="bottom-right">${card.rank}${card.suit}</span>
      `;
    }
    container.appendChild(cardElem);
  });
}

// Update wins in the UI
function updateWinsUI() {
  const playerWinsElem = document.getElementById("player-wins");
  const dealerWinsElem = document.getElementById("dealer-wins");

  playerWinsElem.textContent = `Player Wins: ${playerWins}`;
  dealerWinsElem.textContent = `Dealer Wins: ${dealerWins}`;
}

// Update all game UI elements
function updateUI(hideDealerSecondCard = false) {
  const playerCardsDiv = document.getElementById("player-cards");
  const dealerCardsDiv = document.getElementById("dealer-cards");
  const playerScoreElem = document.getElementById("player-score");
  const dealerScoreElem = document.getElementById("dealer-score");
  const balanceElem = document.getElementById("balance");

  displayCards(playerHand, playerCardsDiv);
  displayCards(dealerHand, dealerCardsDiv, hideDealerSecondCard);

  playerScoreElem.textContent = `Player Score: ${playerScore}`;
  dealerScoreElem.textContent = `Dealer Score: ${hideDealerSecondCard ? "" : dealerScore}`;
  balanceElem.textContent = `${balance}`;

  // Update wins in the UI
  updateWinsUI();
}

// Start Game (Place Bet)
function placeBet() {
  const betInput = parseInt(document.getElementById("bet-amount").value) || 10;

  if (betInput > balance) {
    document.getElementById("result").textContent = "Insufficient balance!";
    return;
  }

  if (document.getElementById("hit").disabled === false) {
    document.getElementById("result").textContent =
      "Finish the current round before starting a new one!";
    return;
  }

  bet = betInput;
  balance -= bet;

  document.getElementById("place-bet").disabled = true;

  checkDeck();
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];
  playerScore = calculateScore(playerHand);
  dealerScore = calculateScore(dealerHand);

  updateUI(true);

  document.getElementById("result").textContent = "";
  document.getElementById("hit").disabled = false;
  document.getElementById("stand").disabled = false;
}

// Hit
function hit() {
  checkDeck();
  playerHand.push(deck.pop());
  playerScore = calculateScore(playerHand);
  updateUI(true);

  if (playerScore > 21) {
    document.getElementById("result").textContent = "You Busted! Dealer Wins.";
    dealerWins++;
    updateUI(); // Update the UI with the new dealer wins
    endGame();
  }
}

// Stand
function stand() {
  updateUI(false);

  while (dealerScore < 17) {
    checkDeck();
    dealerHand.push(deck.pop());
    dealerScore = calculateScore(dealerHand);
  }

  determineWinner();
}

// Determine Winner
function determineWinner() {
  if (dealerScore > 21 || playerScore > dealerScore) {
    document.getElementById("result").textContent = "You Win!";
    balance += bet * 2;
    playerWins++;
    updateDatabaseWins(playerWins);
  } else if (playerScore === dealerScore) {
    document.getElementById("result").textContent = "It's a Tie!";
    balance += bet;
  } else {
    document.getElementById("result").textContent = "Dealer Wins!";
    dealerWins++;
  }

  updateUI(); // Update the UI with the new scores and wins
  endGame();
}

// Update Player Wins in the Database
function updateDatabaseWins(playerWins) {
  const playerId = localStorage.getItem("playerId") || "1"; // Replace with actual player ID logic
  fetch("update_score.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ playerId, gameId: 7, score: playerWins }), // Replace with actual game ID
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log("Player wins updated successfully!");
      } else {
        console.error("Failed to update wins:", data.error || "Unknown error");
      }
    })
    .catch((error) => console.error("Error updating wins:", error));
}

// End Game
function endGame() {
  document.getElementById("hit").disabled = true;
  document.getElementById("stand").disabled = true;

  if (balance <= 0) {
    showGameOverModal();
  } else {
    document.getElementById("place-bet").disabled = false;
  }
}

// Show Game Over Modal
function showGameOverModal() {
  modal.classList.add("active");
  returnHomeButton.addEventListener("click", () => {
    window.location.href = "index.html"; // Replace with the URL of your main page
  });
}

// Initialize Game
createDeck();
updateUI();
document.getElementById("place-bet").addEventListener("click", placeBet);
document.getElementById("hit").addEventListener("click", hit);
document.getElementById("stand").addEventListener("click", stand);
