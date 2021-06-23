// 'use strict';

//======================= Global Variables =======================//

const score = document.querySelector('.score'),
  start = document.querySelector('.start'),
  gameArea = document.querySelector('.gameArea'),
  userCar = document.createElement('div');

userCar.classList.add('userCar');

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
  return document.documentElement.clientHeight / heightElement + 1;
}

function startGame() {
  start.classList.add('hide');

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
    enemyCar.style.left = Math.trunc(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    enemyCar.style.top = enemyCar.y + 'px';
    enemyCar.style.background = 'transparent url(./image/enemy.png) center / cover no-repeat';
    gameArea.appendChild(enemyCar);
  }

  setting.start = true;

  gameArea.appendChild(userCar);
  setting.x = userCar.offsetLeft;
  setting.y = userCar.offsetTop;
  requestAnimationFrame(playGame);
}

function playGame() {

  if (setting.start) {
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
  event.preventDefault();
  keys[event.key] = true;
}

function stopRun(event) {
  event.preventDefault();
  keys[event.key] = false;
}

function moveRoad() {
  let dividingLine = document.querySelectorAll('.lines');

  dividingLine.forEach(function (line) {
    line.y += setting.speed;
    line.style.top = line.y + 'px';

    if (line.y > document.documentElement.clientHeight) {
      line.y = -100;
    }
  });
}

function moveEnemy() {
  let enemyCars = document.querySelectorAll('.enemyCar');

  enemyCars.forEach(function (enemyCar) {
    enemyCar.y += setting.speed / 2;
    enemyCar.style.top = enemyCar.y + 'px';

    if (enemyCar.y > document.documentElement.clientHeight) {
      enemyCar.y = -100 * setting.traffic;
      enemyCar.style.left = Math.trunc(Math.random() * gameArea.offsetWidth) + 'px';
    }
  });
}

//============= End of Handlers of Event Listeners =============//
