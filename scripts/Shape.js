"use strict";

function Shape(typeName, matrix, colorIndex) {
  // General Props
  var _self = this;
  var _type = SHAPE_TYPES[typeName];
  var _name = typeName;
  var _colorIndex = colorIndex;
  var _color = COLOR_MAP[colorIndex];
  var _appended = false;

  // Matrix Private Props
  var _matrix = matrix.clone();
  var _height = _matrix.length;
  var _width = _matrix[0].length;
  var _x = Math.floor(CONFIG.table.cols / 2) - Math.floor(_width / 2);
  var _y = 0;

  // Private Functions
  function _canMove() {
    return !_appended && !IS_PAUSED;
  }

  function _changeMatrix(isRight) {
    _self.erase();
    if (isRight) {
      rotateMatrixToRight(_matrix);
    } else {
      rotateMatrixToLeft(_matrix);
    }
    _height = _matrix.length;
    _width = _matrix[0].length;
    _self.paint();
  }

  function _iterateOverPixels(cb) {
    for (var y = 0; y < _matrix.length; y++) {
      for (var x = 0; x < _matrix[y].length; x++) {
        if (!_matrix[y][x]) continue;
        var pixelY = _y + y;
        var pixelX = _x + x;
        if (!cb(pixelX, pixelY)) return;
      }
    }
  }

  function _iterateOverNewMatrixPixels(newMatrix, cb) {
    for (var y = 0; y < newMatrix.length; y++) {
      for (var x = 0; x < newMatrix[y].length; x++) {
        if (!newMatrix[y][x]) continue;
        var pixelY = _y + y;
        var pixelX = _x + x;
        if (!cb(pixelX, pixelY)) return;
      }
    }
  }

  function _canMoveTo(evalNextX, evalNextY) {
    var can = true;

    _iterateOverPixels(function (x, y) {
      var nextX = evalNextX(x);
      var nextY = evalNextY(y);

      if (PIXEL_MATRIX[nextY + "-" + nextX]) {
        return (can = false);
      }
      return true;
    });

    return can;
  }

  function _canRotateTo(isRight) {
    var can = true;
    var newMatrix = _matrix.clone();

    if (isRight) {
      rotateMatrixToRight(newMatrix);
    } else {
      rotateMatrixToLeft(newMatrix);
    }

    _iterateOverNewMatrixPixels(newMatrix, function (x, y) {
      if (PIXEL_MATRIX[y + "-" + x]) {
        return (can = false);
      }
      if (x >= CONFIG.table.cols) {
        return (can = false);
      }
      if (y >= CONFIG.table.rows) {
        return (can = false);
      }
      return true;
    });

    return can;
  }

  // Public Getter Functions
  this.getName = function () { return _name }
  this.getMatrix = function () { return _matrix.clone() }
  this.getColorIndex = function () { return _colorIndex }
  this.getX = function () { return _x }
  this.getY = function () { return _y }
  this.getWidth = function () { return _width }
  this.getHeight = function () { return _height }
  
  // Public Setter Functions
  this.setX = function (x) { _x = x }
  this.setY = function (y) { _y = y }

  // Other Public Functions
  this.paint = function () {
    _iterateOverPixels(function (x, y) {
      if (x < 0 || y < 0) return true;
      var pixel = new Pixel(x, y);

      pixel.paint(_color);
      pixel = null;
      return true;
    });
  };

  this.erase = function () {
    _iterateOverPixels(function (x, y) {
      if (x < 0 || y < 0) return true;
      var pixel = new Pixel(x, y);

      pixel.erase();
      pixel = null;
      return true;
    });
  };

  this.rotateRight = function () {
    if (!_canMove()) return;
    if (!_canRotateTo(true)) return;
    _changeMatrix(true);
  };

  this.rotateLeft = function () {
    if (!_canMove()) return;
    if (!_canRotateTo(false)) return;
    _changeMatrix(false);
  };

  this.moveLeft = function () {
    if (!_canMove()) return;
    if (_x === 0) return;
    if (!_canMoveTo(
      function (x) { return x - 1 },
      function (y) { return y }
    )) {
      return;
    }
    _self.erase();
    _x--;
    _self.paint();
  };

  this.moveRight = function () {
    if (!_canMove()) return;
    if (_x + _width === CONFIG.table.cols) return;
    if (!_canMoveTo(
      function (x) { return x + 1 },
      function (y) { return y }
    )) {
      return;
    }
    _self.erase();
    _x++;
    _self.paint();
  };

  this.moveDown = function (stopCb) {
    if (!_canMove()) return;
    if (
      _y + _height === CONFIG.table.rows
      ||
      !_canMoveTo(
        function (x) { return x },
        function (y) { return y + 1 }
      )) {
      _appended = true;
      stopCb();
      return;
    }
    _self.erase();
    _y++;
    _self.paint();
  };

  this.appendToTable = function () {
    _appended = true;
    _iterateOverPixels(function(x, y) {
      PIXEL_MATRIX[y + "-" + x] = _colorIndex;
      return true;
    });
  };
  
  this.isDrawable = function () {
    var drawable = true;
    
    _iterateOverPixels(function (x, y) {
      if (PIXEL_MATRIX[y + "-" + x]) return (drawable = false);
      if (x >= CONFIG.table.cols) return (drawable = false);
      if (y >= CONFIG.table.rows) return (drawable = false);
      return true;
    });
    
    return drawable;
  };
  
}