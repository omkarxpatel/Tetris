"use static";

var GENERAL_STATUS = new (function GenStatus() {
  var _elem = document.getElementById("game-status");
  var _text = CONFIG.start.text;

  _elem.innerHTML = _text;

  this.start = function () {
    _elem.innerHTML = CONFIG.start.text;
  };

  this.resume = function () {
    _elem.innerHTML = CONFIG.resume.text;
  };

  this.pause = function () {
    _elem.innerHTML = CONFIG.pause.text;
  };

  this.tryAgain = function () {
    _elem.innerHTML = CONFIG.tryAgain.text;
  };

  this.gameOver = function () {
    _elem.innerHTML = CONFIG.over.text;
  };
})();
