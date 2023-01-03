"use strict";

function Pixel(x, y) {
  var _x = x;
  var _y = y;
  var _pixEl = document.getElementById("pixel-" + y + "-" + x);

  this.paint = function (color) {
    _pixEl.style.backgroundColor = color;
  };

  this.erase = function () {
    _pixEl.style.backgroundColor = "";
  };

  this.addClass = function (className) {
    _pixEl.classList.add(className);
  };

  this.rmClass = function (className) {
    _pixEl.classList.remove(className);
  };
}