// 'use strict';

//======================= Global Variables =======================//

const score = document.querySelector('.score'),
  start = document.querySelector('.start'),
  gameArea = document.querySelector('.gameArea'),
  car = document.createElement('div');

car.classList.add('car');

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false
}

const setting = {
  start: false,
  score: 0,
  speed: 3
}

//=================== End of Global Variables ===================//



//======================== Event Listeners =======================//

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun)

//==================== End of Event Listeners ===================//



//================= Handlers of Event Listeners =================//

function startGame() {
  start.classList.add('hide');
  setting.start = true;
  gameArea.appendChild(car);
  requestAnimationFrame(playGame);
}

function playGame() {
  console.log('Play game!');
  if (setting.start) {
    requestAnimationFrame(playGame);
  }
}

function startRun(event) {
  event.preventDefault();
  keys[event.key] = true;
}

function stopRun(event) {
  event.preventDefault();
  keys[event.key] = false;
}

//============= End of Handlers of Event Listeners =============//
