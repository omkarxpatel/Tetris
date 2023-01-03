"use strict";

window.onload = function () {
  LOADING.init();
  SCORE.init();
  LIFE.init();
  HOLD.init();
  NEXT.init();
  GAME.init();
  GAME.getNewShape();
  GAME.renderFrame();
};

window.onkeydown = function (e) {
  if (LOADING.isLoading()) return;

  // Other keys
  switch(e.keyCode) {
    case KEY_ENTER:
      if (GAME_OVER) return GAME.restart();
      GAME.togglePause();
      break;
  }

  if (IS_PAUSED) return;

  // Game Keys
  switch (e.keyCode) {
    case KEY_A:
    case KEY_LEFT:
      GAME.moveLeft();
      break;
    case KEY_D:
    case KEY_RIGHT:
      GAME.moveRight();
      break;
    case KEY_E:
    case KEY_W:
    case KEY_UP:
      GAME.rotateRight();
      break;
    case KEY_Q:
      GAME.rotateLeft();
      break;
    case KEY_S:
    case KEY_DOWN:
      GAME.speedItUp();
      break;
    case KEY_CTRL:
      GAME.hold();
      break;
  }
};

window.onkeyup = function (e) {
  if (IS_PAUSED || LOADING.isLoading()) return;
  // Game keys
  switch (e.keyCode) {
    case KEY_S:
    case KEY_DOWN:
      GAME.speedItDown();
      break;
  }
};
