"use strict";

var LOADING = new (function() {
  var _isLoading = true;
  var _elem = null;

  this.isLoading = function () {
    return _isLoading;
  };

  this.init = function () {
    _elem = document.getElementById("game-loading-overlay");
  };

  this.endLoading = function () {
    _isLoading = false;
    _elem.classList.add("game-loading-fading-out");
    setTimeout(function() {
      _elem.style.display = "none";
    }, 1000);
  };
})();