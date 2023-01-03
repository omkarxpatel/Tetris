"use strict";

var SCORE = new (function() {
  var _self = this;
  var _elem = null;
  var _score = 0;
  var _isAnimating = false;

  // Private Functions
  function _showScore(num) {
    _elem.innerHTML = num || _score;
  }

  function _getShownScore() {
    return Number(_elem.innerText);
  }

  function _addScoreAnimated() {
    setTimeout(function () {
      if (!_isAnimating) return;

      var shownScore = _getShownScore();
      _showScore(++shownScore);

      if (shownScore === _score) {
        _isAnimating = false;
        return;
      }

      _addScoreAnimated();
    }, 10);
  }

  // Public Functions
  this.init = function() {
    _elem = document.getElementById("game-points-num");
  };

  this.add = function (num) {
    _score += num;
    if (_isAnimating) return;
    _isAnimating = true;
    _addScoreAnimated();
  };

  this.reset = function () {
    _isAnimating = false;
    _score = 0;
    _showScore();
  };

  this.get = function () {
    return _score;
  };
})();