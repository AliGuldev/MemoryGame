"use strict";
const grid = document.getElementById('game');
const moveDisplay = document.getElementById('moves');
const statusDisplay = document.getElementById('status');
const colorPicker = document.getElementById('settings');
const timerDisplay = document.getElementById('timer');

let seconds = 0;
let timerInterval;
let cards = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;

//Pure function
function shuffle(array) {
    //ES6 Arrow Feature
  return array.sort(() => Math.random() - 0.5);
}

function startTimer() {
  clearInterval(timerInterval); 
  seconds = 0;
  
  timerInterval = setInterval(() => {
    seconds++;
    timerDisplay.textContent = `Time: ${seconds}s`;
  }, 1000);
}

function createGrid() {
  shuffle(cards);
  grid.innerHTML = '';
  cards.forEach((letter) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = letter;
    card.textContent = '';    
    //Listening to an event
    card.addEventListener('click', flipCard);
    grid.appendChild(card);
  });
  startTimer()
}

function flipCard() {
  if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
    this.classList.add('flipped');
    this.textContent = this.dataset.symbol;
    flippedCards.push(this);

    if (flippedCards.length === 2) {
      moves++;
      //Manipulated DOM
      moveDisplay.textContent = `Moves: ${moves}`;      
      checkMatch();
    }
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  
  if (card1.dataset.symbol === card2.dataset.symbol) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    flippedCards = [];
    matchedPairs++;
    
    if (matchedPairs === cards.length / 2) {
      statusDisplay.textContent = `Game Over! Total Moves: ${moves} Total Time: ${seconds}`;
      clearInterval(timerInterval);
    }
  } else {
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      card1.textContent = '';
      card2.textContent = '';
      flippedCards = [];
    }, 1000);
  }
}

colorPicker.addEventListener('input', (event) => {
  const newColor = event.target.value;
  document.documentElement.style.setProperty('--card-bg', newColor);
});

function resetGame() {
  moves = 0;
  matchedPairs = 0;
  flippedCards = [];
  moveDisplay.textContent = `Moves: ${moves}`;      
  createGrid();
  startTimer()
  statusDisplay.textContent = '';
}
createGrid();