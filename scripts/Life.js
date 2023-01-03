"use strict";

var LIFE = new (function () {
  var _self = this;
  var _elem = null;
  var _lives = 0;

  // Private Functions
  function _showLives(num) {
    _elem.innerHTML = num || _lives;
  }

  // Public Functions
  this.init = function () {
    _elem = document.getElementById("game-lives-num");
    _lives = CONFIG.start.lives;
    _showLives();
  };

  this.reduce = function () {
    if (!_lives) return;
    _showLives(--_lives);
  };

  this.reset = function () {
    _lives = CONFIG.start.lives;
    _showLives();
  };

  this.get = function () {
    return _lives;
  };
})();