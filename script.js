"use strict";
const grid = document.getElementById('game');
const moveDisplay = document.getElementById('moves');
const globalMoveDisplay = document.getElementById('globalMoves');
const statusDisplay = document.getElementById('status');
const colorPicker = document.getElementById('settings');
const timerDisplay = document.getElementById('timer');


let seconds = parseInt(sessionStorage.getItem('seconds')) || 0;
let timerInterval;
let cards = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'];
let flippedCards = [];
let matchedPairs = sessionStorage.getItem('matchedPairs') || 0;
let globalMoves = parseInt(localStorage.getItem('globalMoves')) || 0;
let moves = parseInt(sessionStorage.getItem('moves')) || 0;
moveDisplay.textContent = `Moves: ${moves}`; 
globalMoveDisplay.textContent = `globalMoves: ${globalMoves}`; 


//Pure function
function shuffle(array) {
    //ES6 Arrow Feature
  return array.sort(() => Math.random() - 0.5);
}

function startTimer() {
  clearInterval(timerInterval); 
  
  timerInterval = setInterval(() => {
    seconds++;
    timerDisplay.textContent = `Time: ${seconds}s`;
    sessionStorage.setItem('seconds', seconds);
  }, 1000);
}

function createGrid() {

    const sessionDeck = JSON.parse(sessionStorage.getItem('cards'));

  if (sessionDeck) {
    cards = sessionDeck;
  } else {
    shuffle(cards);
    sessionStorage.setItem('cards', JSON.stringify(cards));
  }

  grid.innerHTML = '';
  const matchedStates = JSON.parse(sessionStorage.getItem('matchedStates')) || [];

  cards.forEach((letter, index) => {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.symbol = letter;
  card.dataset.index = index;
  card.textContent = '';    

    if (matchedStates.includes(index.toString()) || matchedStates.includes(index)) {
      card.classList.add('flipped', 'matched');
      card.textContent = letter;
    } else {
      card.textContent = '';
    }
    
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
      globalMoves++;
      sessionStorage.setItem('moves', moves); 
      localStorage.setItem('globalMoves', globalMoves);

      //Manipulated DOM
      moveDisplay.textContent = `Moves: ${moves}`;      
      globalMoveDisplay.textContent = `globalMoves: ${globalMoves}`;
      checkMatch();
      
    }
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  
  if (card1.dataset.symbol === card2.dataset.symbol) {
    card1.classList.add('matched');
    card2.classList.add('matched');

    let matchedStates = JSON.parse(sessionStorage.getItem('matchedStates')) || [];
    matchedStates.push(card1.dataset.index, card2.dataset.index);
    sessionStorage.setItem('matchedStates', JSON.stringify(matchedStates));

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
  sessionStorage.removeItem('matchedStates');
  sessionStorage.removeItem('cards');
  sessionStorage.removeItem('moves');
  sessionStorage.removeItem('seconds');
  seconds = 0;
  sessionStorage.setItem('seconds', 0);
  moves = 0;
  globalMoves = 0;
  matchedPairs = 0;
  flippedCards = [];
  moveDisplay.textContent = `Moves: ${moves}`;      
  globalMoveDisplay.textContent = `globalMoves: ${globalMoves}`;
  createGrid();
  startTimer()
  statusDisplay.textContent = '';
}
createGrid();