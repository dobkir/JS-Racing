'use strict';

//======================= Global Variables =======================//
const MAX_ENEMY_CARS = 7;
const HEIGHT_ELEM = 100;

const score = document.querySelector('.score'),
  start = document.querySelector('.start'),
  gameArea = document.querySelector('.gameArea'),
  userCar = document.createElement('div'),
  btns = document.querySelectorAll('.btn');

userCar.classList.add('userCar');

/* 
// Add music to the game (method 'embed')
const music = document.createElement('embed');
music.src = 'music.mp3';
music.classList.add('visually-hidden');
*/

// Add music to the game (object 'audio')
const music = new Audio('music.mp3');
music.volume = 0.1;


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



//======================== Event Listeners =======================//

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

//==================== End of Event Listeners ===================//



//================= Handlers of Event Listeners =================//

/**
 * This function returns the number of elements that can be placed on the page.
 **/
function getQuantityElementElements(heightElement) {
  return gameArea.offsetHeight / heightElement + 1;
}

function getRandomEnemyCar(max) {
  return Math.floor((Math.random() * max) + 1);
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
  btns.forEach(btn => btn.disabled = true);

  //=================== End of the choice of the game difficulty level ===================//

  gameArea.style.minHeight = Math.floor((document.documentElement.clientHeight - HEIGHT_ELEM) / HEIGHT_ELEM) * HEIGHT_ELEM;

  start.classList.add('hide');

  gameArea.innerHTML = '';

  /*  Add music to the game (method 'embed')
  // Adding music to the game
  
  document.body.append(music);
  
  // Removing music from the game
    
  setTimeout(() => {
    music.remove();
  }, 4000);
  */

  music.play();

  /**
   * Lines are used to animate the movement of the car
   **/
  for (let i = 0; i < getQuantityElementElements(HEIGHT_ELEM); i++) {
    const lines = document.createElement('div');
    lines.classList.add('lines');
    lines.style.top = (i * HEIGHT_ELEM) + 'px';
    lines.style.height = (HEIGHT_ELEM / 2) + 'px';
    lines.y = i * HEIGHT_ELEM;
    gameArea.append(lines);
  }

  /**
   * The traffic of enemy cars on the road
   **/
  for (let i = 0; i < getQuantityElementElements(HEIGHT_ELEM * setting.traffic); i++) {
    const enemyCar = document.createElement('div');
    enemyCar.classList.add('enemyCar');
    enemyCar.y = -HEIGHT_ELEM * setting.traffic * (i + 1);
    enemyCar.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    enemyCar.style.top = enemyCar.y + 'px';
    enemyCar.style.background = `
    transparent 
    url(./image/enemy${getRandomEnemyCar(MAX_ENEMY_CARS)}.png) 
    center / contain
    no-repeat`;
    gameArea.append(enemyCar);
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

//================= Play the game =================//

function playGame() {

  if (setting.start) {
    setting.score += setting.speed;
    score.innerHTML = 'SCORE:<br>' + setting.score;

    setting.speed = startSpeed + Math.floor(setting.score / 5000);  // When the difficulty increases along with scores.

    moveRoad();
    moveEnemy();

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
    // After the end of the game, buttons of the difficulty choice must be unblocked
    btns.forEach(btn => btn.disabled = true);
    // And music must be reload.
    music.load();
  }
}

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

function moveEnemy() {
  let enemyCars = document.querySelectorAll('.enemyCar');

  enemyCars.forEach(function (enemyCar) {
    /**
     * elem.getBoundingClientRect() returns window coordinates for a minimal
     * rectangle that encloses elem as an object of built-in DOMRect class.
     * Used this method so that cars cannot drive through each other.
     **/
    let userCarRect = userCar.getBoundingClientRect();
    let enemyCarRect = enemyCar.getBoundingClientRect();

    /**
     * When rectangles of cars intersected, 
     * the game should be stopped.
     **/
    if (userCarRect.top <= enemyCarRect.bottom &&
      userCarRect.right >= enemyCarRect.left &&
      userCarRect.left <= enemyCarRect.right &&
      userCarRect.bottom >= enemyCarRect.top) {
      setting.start = false;

      console.warn('WTF?!');
      start.classList.remove('hide');
    }

    enemyCar.y += setting.speed / 2;
    enemyCar.style.top = enemyCar.y + 'px';

    if (enemyCar.y >= gameArea.offsetHeight) {
      enemyCar.y = -HEIGHT_ELEM * setting.traffic;
      enemyCar.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    }
  });
}

//============= End of Handlers of Event Listeners =============//
