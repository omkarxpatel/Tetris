"use strict";

var NEXT = new (function () {
  var _self = this;
  var _shapeIdPrefix = "next-piece-shape-";
  var _pixelSize = 12; // in pixels
  
  var _nextElem = null;
  var _shapeStack = {};
  var _firstShapeId = 0;
  var _lastShapeId = 0;
  
  // Private Functions
  function _makeShapeId(shapeNum) {
    return _shapeIdPrefix + shapeNum;
  }
  
  function _iterateShapeAllPixels (shape, cb) {
    var width = shape.getWidth();
    var height = shape.getHeight();
    
    for (var y=0; y < height; y++) {
      for (var x=0; x < width; x++) {
        if (!cb(x, y)) return;
      }
    }
  }
  
  function _addShapeElemPixels (shape, shapeElem) {
    var matrix = shape.getMatrix();
    var colorIndex = shape.getColorIndex();
    
    _iterateShapeAllPixels(shape, function (x, y) {
      var div = document.createElement("div");
      div.classList.add("game-next-shape-pixel");
      div.style.backgroundColor = COLOR_MAP[colorIndex];
      if (!matrix[y][x]) div.style.opacity = 0;
      shapeElem.appendChild(div);
      return true;
    });
  }
  
  function _addShapeElem (shape, id) {
    var shapeElem = document.createElement("div");
    var shapeWidth = (shape.getWidth() * _pixelSize) + "px";
    var shapeHeight = (shape.getHeight() * _pixelSize) + "px";
    
    shapeElem.setAttribute("id", id);
    shapeElem.classList.add("game-next-shape");
    shapeElem.style.width = shapeWidth;
    shapeElem.style.height = shapeHeight;
    
    _addShapeElemPixels(shape, shapeElem);
    
    _nextElem.appendChild(shapeElem);
  }
  
  function _rmFirstShapeElem () {
    var firstShapeElem = document.getElementById(
      _makeShapeId(_firstShapeId)
    );
    _nextElem.removeChild(firstShapeElem);
  }
  
  function _rmAllShapeElems () {
    for (var shapeElemId in _shapeStack) {
      var shapeElem = document.getElementById(shapeElemId);
      _nextElem.removeChild(shapeElem);
    }
  }
  
  // Public Functions
  this.init = function () {
    _nextElem = document.getElementById("game-next");
  };
  
  this.push = function (shape) {
    var id = _makeShapeId(_lastShapeId++);
    _shapeStack[id] = shape;
    _addShapeElem(shape, id);
  };
  
  this.pop = function () {
    var id = _makeShapeId(_firstShapeId);
    var shape = _shapeStack[id];
    delete _shapeStack[id];
    _rmFirstShapeElem();
    _firstShapeId++;
    return shape;
  };
  
  this.empty = function () {
    _rmAllShapeElems();
    _shapeStack = {};
    _firstShapeId = 0;
    _lastShapeId = 0;
  };
  
})();