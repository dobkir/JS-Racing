'use strict';

//======================= Global Variables =======================//
const MAX_ENEMY_CARS = 7;

const score = document.querySelector('.score'),
  start = document.querySelector('.start'),
  gameArea = document.querySelector('.gameArea'),
  userCar = document.createElement('div');

userCar.classList.add('userCar');

/* 
// Add music to the game (method 'embed')
const music = document.createElement('embed');
music.src = 'music.mp3';
music.classList.add('visually-hidden');
*/

// Add music to the game (object 'audio')
const music = new Audio('music.mp3');



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
  return document.documentElement.clientHeight / heightElement;
}

function getRandomEnemyCar(max) {
  return Math.floor((Math.random() * max) + 1);
}

function startGame() {
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
  for (let i = 0; i < getQuantityElementElements(100); i++) {
    const lines = document.createElement('div');
    lines.classList.add('lines');
    lines.style.top = (i * 100) + 'px';
    lines.y = i * 100;
    gameArea.appendChild(lines);
  }

  /**
   * The traffic of enemy cars on the road
   **/
  for (let i = 0; i < getQuantityElementElements(100 * setting.traffic); i++) {
    const enemyCar = document.createElement('div');
    enemyCar.classList.add('enemyCar');
    enemyCar.y = -100 * setting.traffic * (i + 1);
    enemyCar.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    enemyCar.style.top = enemyCar.y + 'px';
    enemyCar.style.background = `
    transparent 
    url(./image/enemy${getRandomEnemyCar(MAX_ENEMY_CARS)}.png) 
    center / cover 
    no-repeat`;
    gameArea.appendChild(enemyCar);
  }

  setting.score = 0;
  setting.start = true;

  gameArea.appendChild(userCar);
  userCar.style.left = '125px';
  userCar.style.top = 'auto';
  userCar.style.bottom = '10px';
  setting.x = userCar.offsetLeft;
  setting.y = userCar.offsetTop;
  requestAnimationFrame(playGame);
}

function playGame() {

  if (setting.start) {
    setting.score += setting.speed;
    score.innerHTML = 'SCORE:<br>' + setting.score;
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

    if (line.y >= document.documentElement.clientHeight) {
      line.y = -100;
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
      music.load();
      console.warn('WTF?!');
      start.classList.remove('hide');
      score.style.top = start.offsetHeight;
    }

    enemyCar.y += setting.speed / 2;
    enemyCar.style.top = enemyCar.y + 'px';

    if (enemyCar.y >= document.documentElement.clientHeight) {
      enemyCar.y = -100 * setting.traffic;
      enemyCar.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    }
  });
}

//============= End of Handlers of Event Listeners =============//
