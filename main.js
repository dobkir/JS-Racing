'use strict';

//======================= Global Variables =======================//
const MAX_BOT_CARS = 7;
const HEIGHT_ELEM = 100;

const inviteStart = document.querySelector('.system__invite--start'),
  inviteGame = document.querySelector('.system__invite--game'),
  inviteContinue = document.querySelector('.system__invite--continue'),
  startPanel = document.querySelector('.panel__start'),
  scorePanel = document.querySelector('.panel__score'),
  gamePanel = document.querySelector('.panel__game'),
  gameArea = document.querySelector('.gameArea'),
  buttons = document.querySelectorAll('.btn'),
  gamePaused = document.querySelector('.game--paused'),
  gameContinue = document.querySelector('.game--continue'),
  gameMain = document.querySelector('.game--main'),
  userCar = document.createElement('div');

userCar.classList.add('userCar');

// Add music to the game (object 'audio')
const music = new Audio('music.mp3');
music.volume = 0.15;


const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false
};

const setting = {
  start: false,
  score: 0,
  speed: 3,
  traffic: 3
};

let startSpeed = 0;  // When the difficulty increases along with scores.

//=================== End of Global Variables ===================//







//================= Handlers of Event Listeners =================//

/**
 * This function returns the number of elements that can be placed on the page.
 **/
function getQuantityElementElements(heightElement) {
  return gameArea.offsetHeight / heightElement + 1;
}

function getRandomBotCar(max) {
  return Math.floor(Math.random() * max + 1);
}

function changeLevel(lvl) {
  switch (lvl) {
    case '1':
      setting.traffic = 4;
      setting.speed = 3;
      break;
    case '2':
      setting.traffic = 3;
      setting.speed = 6;
      break;
    case '3':
      setting.traffic = 2;
      setting.speed = 8;
      break;
  }

  startSpeed = setting.speed;  // When the difficulty increases along with scores.
}

//================= Start the game =================//

function startGame(event) {
  //=================== The choice of the game difficulty level ===================//

  const target = event.target;
  if (!target.classList.contains('btn')) return;
  const levelGame = target.dataset.levelGame;
  changeLevel(levelGame);

  // After the choice of the difficulty, buttons must be blocked
  // buttons.forEach(button => button.disabled = true);

  //=================== End of the choice of the game difficulty level ===================//

  // Set game area height
  gameArea.style.minHeight = Math.floor((document.documentElement.clientHeight - HEIGHT_ELEM) / HEIGHT_ELEM) * HEIGHT_ELEM;

  inviteStart.classList.add('hide');
  inviteGame.classList.remove('hide');
  startPanel.classList.add('hide');
  gamePanel.classList.remove('hide');

  gameArea.innerHTML = '';

  /**
   * Lines are used to animate the movement of the car
   **/
  for (let i = 0; i < getQuantityElementElements(HEIGHT_ELEM); i++) {
    const lines = document.createElement('div');
    lines.classList.add('lines');
    lines.style.top = i * HEIGHT_ELEM + 'px';
    lines.style.height = HEIGHT_ELEM / 2 + 'px';
    lines.y = i * HEIGHT_ELEM;
    gameArea.append(lines);
  }

  /**
   * The traffic of enemy cars on the road
   **/
  for (let i = 0; i < getQuantityElementElements(HEIGHT_ELEM * setting.traffic); i++) {
    const botCar = document.createElement('div');
    botCar.classList.add('botCar');
    botCar.y = -HEIGHT_ELEM * setting.traffic * (i + 1);
    botCar.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    botCar.style.top = botCar.y + 'px';
    botCar.style.background = `
    transparent 
    url(./image/enemy${getRandomBotCar(MAX_BOT_CARS)}.png) 
    center / contain
    no-repeat`;
    gameArea.append(botCar);
  }

  setting.score = 0;
  setting.start = true;

  gameArea.append(userCar);
  userCar.style.left = '125px';
  userCar.style.top = 'auto';
  userCar.style.bottom = '10px';
  setting.x = userCar.offsetLeft;
  setting.y = userCar.offsetTop;
  requestAnimationFrame(playGame);
}

//================= The End of Start the game =================//


//================= Play the game =================//

function playGame() {


  gamePaused.disabled = false;
  gameContinue.disabled = true;

  /**
   * Add music to the game 
  **/
  music.play();

  if (setting.start) {
    setting.score += setting.speed;
    scorePanel.innerHTML = 'SCORE:<br>' + setting.score;

    setting.speed = startSpeed + Math.floor(setting.score / 5000);  // When the difficulty increases along with scores.

    moveRoad();
    moveBots();

    if (keys.ArrowLeft && setting.x > 0) {
      setting.x -= setting.speed;
    }
    if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - userCar.offsetWidth)) {
      setting.x += setting.speed;
    }
    if (keys.ArrowUp && setting.y > 0) {
      setting.y -= setting.speed;
    }
    if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - userCar.offsetHeight)) {
      setting.y += setting.speed;
    }

    userCar.style.left = setting.x + 'px';
    userCar.style.top = setting.y + 'px';

    requestAnimationFrame(playGame);
  } else {
    stopGame()
  }
}

//================= The End of Play the game =================//

function startRun(event) {
  if (keys.hasOwnProperty(event.key)) {
    event.preventDefault();
    keys[event.key] = true;
  }
}

function stopRun(event) {
  if (keys.hasOwnProperty(event.key)) {
    event.preventDefault();
    keys[event.key] = false;
  }
}

function moveRoad() {
  let dividingLine = document.querySelectorAll('.lines');

  dividingLine.forEach(function (line) {
    line.y += setting.speed;
    line.style.top = line.y + 'px';

    if (line.y >= gameArea.offsetHeight) {
      line.y = -HEIGHT_ELEM;
    }
  });
}

function moveBots() {
  let botCars = document.querySelectorAll('.botCar');

  botCars.forEach(function (botCar) {
    /**
     * elem.getBoundingClientRect() returns window coordinates for a minimal
     * rectangle that encloses elem as an object of built-in DOMRect class.
     * Used this method so that cars cannot drive through each other.
     **/
    let userCarRect = userCar.getBoundingClientRect();
    let botCarRect = botCar.getBoundingClientRect();

    /**
     * When rectangles of cars intersected, 
     * the game should be stopped.
     **/
    if (userCarRect.top <= botCarRect.bottom &&
      userCarRect.right >= botCarRect.left &&
      userCarRect.left <= botCarRect.right &&
      userCarRect.bottom >= botCarRect.top) {
      setting.start = false;

      console.warn('WTF?!');
    }

    botCar.y += setting.speed / 2;
    botCar.style.top = botCar.y + 'px';

    if (botCar.y >= gameArea.offsetHeight) {
      botCar.y = -HEIGHT_ELEM * setting.traffic;
      botCar.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    }
  });
}

function pausedGame() {
  gamePaused.disabled = true;
  console.log(gamePaused.disabled);
  gameContinue.disabled = false;
  inviteGame.classList.add('hide');
  inviteContinue.classList.remove('hide');
  music.pause();
  setting.start = false;
  // requestAnimationFrame(playGame);
}

function continueGame() {
  setting.start = true;
  inviteGame.classList.remove('hide');
  inviteContinue.classList.add('hide');
  playGame();
}

function stopGame() {
  // And music must be reload.
  music.load();
}

// function stopGame() {
//   // cancelAnimationFrame(startGame);
//   // cancelAnimationFrame(playGame);
//   setting.score = 0;
//   setting.start = false;
//   startSpeed = 0;
//   inviteStart.classList.remove('hide');
//   inviteGame.classList.add('hide');
//   startPanel.classList.remove('hide');
//   gamePanel.classList.add('hide');

//   // After the end of the game, buttons of the difficulty choice must be unblocked
//   buttons.forEach(btn => btn.disabled = false);
//   // And music must be reload.
//   music.load();

//   gameArea.innerHTML = '';
//   gameArea.style.minHeight = 0;
// }

//============= End of Handlers of Event Listeners =============//

//======================== Event Listeners =======================//

startPanel.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

gamePaused.addEventListener('click', pausedGame);
gameContinue.addEventListener('click', continueGame);
gameMain.addEventListener('click', stopGame());

//==================== End of Event Listeners ===================//