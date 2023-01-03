"use strict";

var HOLD = new (function() {
  var _self = this;
  var _pixelIdPrefix = "hold-pixel-";
  
  var _shape = null;
  var _matrix = null;
  var _width = null;
  var _height = null;
  var _x = 0;
  var _y = 0;
  var _colorIndex = null;
  var _isLocked = false;
  
  var _tableElem = null;
  var _lockIcon = null;
  var _cellSize = 12; // in pixels
  
  // Private Functions
  function _getPixelId(x, y) {
    return _pixelIdPrefix + y + "-" + x;
  }
  
  function _makePixel(x, y) {
    var div = document.createElement("div");
    div.classList.add("game-hold-table-pixel");
    div.setAttribute("id", _getPixelId(x, y));
    return div;
  }
  
  function _registerShape(shape) {
    _shape = shape;
    _matrix = shape.getMatrix();
    _width = shape.getWidth();
    _height = shape.getHeight();
    _x = _width !== 4 ? 1 : 0;
    _y = _height !== 4 ? 1 : 0;
    _colorIndex = shape.getColorIndex();
  }
  
  function _iterateTablePixels(cb) {
    for (var y=0; y < _height; y++) {
      for (var x=0; x < _width && cb(x++, y);)
       ;
    }
  }
  
  function _iterateMatrixPixels(cb) {
    for (var y=0; y < _height; y++) {
      for (var x=0; x < _width; x++) {
        if (!_matrix[y][x]) continue;
        if (!cb(x, y)) return;
      }
    }
  }
  
  function _getPixEl(x, y) {
    return document.getElementById(_getPixelId(x, y));
  }
  
  function _erasePixel(x, y) {
    _getPixEl(x, y).style.backgroundColor = "";
  }
  
  function _paintPixel(x, y, colorIndex) {
    var pixEl = _getPixEl(x, y);
    pixEl.style.backgroundColor = COLOR_MAP[colorIndex];
  };
  
  function _eraseTable() {
    _iterateTablePixels(function(x, y) {
      _erasePixel(x, y);
      return true;
    });
  }
  
  function _removeTablePixels() {
    while (_tableElem.firstChild) {
      _tableElem.removeChild(_tableElem.firstChild);
    }
  }
  
  function _makeShapeTable() {
    var tabWidth = _width * _cellSize;
    var tabHeight = _height * _cellSize;
    
    _tableElem.style.width = tabWidth + "px";
    _tableElem.style.height = tabHeight + "px";
    
    for (var y=0; y < _height; y++) {
      for (var x=0; x < _width; x++) {
        var pixEl = _makePixel(x, y);
        if (!_matrix[y][x]) pixEl.style.opacity = 0;
        _tableElem.appendChild(pixEl);
      }
    }
  }
  
  function _drawShape() {
    _removeTablePixels();
    _makeShapeTable();
    _iterateMatrixPixels(function(x, y) {
      _paintPixel(x, y, _colorIndex);
      return true;
    });
  }
  
  function _lock() {
    _isLocked = true;
    _lockIcon.style.display = "inline-block";
  }
  
  function _unlock() {
    _isLocked = false;
    _lockIcon.style.display = "none";
  }
  
  // Public Functions
  this.init = function() {
    _tableElem = document.getElementById("game-hold-table");
    _lockIcon = document.getElementById("game-hold-lock");
    _unlock();
  };
  
  this.getShape = function () { return _shape };
  
  this.hold = function (shape) {
    if (_isLocked) return;
    _registerShape(shape);
    _drawShape();
  };
  
  this.lock = _lock;
  this.unlock = _unlock;
  this.isLocked = function () { return _isLocked };
  
  this.empty = function () {
    _shape = null;
    _removeTablePixels();
    _unlock();
  };
  
})();
