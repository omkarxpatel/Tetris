"use strict";

var GAME = new (function () {
  var _self = this;
  var _handShape = null; // Shape Obj
  var _frameRate = CONFIG.start.speed; // in milliseconds
  var _speedFrameRate = 40; // in milliseconds
  var _isSpeed = false;
  var _lastColorIndex = null;
  var _mainFrameTimeout = null;

  var _tableElem = null;
  var _pauseBtnIconElem = null;

  // Private Functions
  function _setMainTimeout(cb, frameRate) {
    _mainFrameTimeout = setTimeout(cb, frameRate);
  }

  function _stopCallback() {
    _handShape.appendToTable();
    if (!TABLE.isRowEmpty(0)) return _gameOver();
    TABLE.checkForResolvableRows()
      .then(function(resolvedRowsCount) {
        _self.getNewShape();
        HOLD.unlock();
        if (_frameRate <= _speedFrameRate) return;
        _frameRate -= resolvedRowsCount * 10;
      });
  }

  function _gameOver() {
    GAME_OVER = true;
    LIFE.reduce();
    if (LIFE.get()) {
      GENERAL_STATUS.tryAgain();
      return;
    }
    GENERAL_STATUS.gameOver();
    _frameRate = CONFIG.start.speed;
  }

  function _makePixel(x, y) {
    var div = document.createElement("div");
    div.classList.add("game-table-pixel");
    div.setAttribute("id", "pixel-" + y + "-" + x);
    div.style.width = div.style.height = CONFIG.pixel.size + "px";
    return div;
  }

  function _getRandomShape() {
    var typeName = _getRandomTypeName();
    var type = SHAPE_TYPES[typeName];
    var matrix = _getRandomMatrix(type);
    var colorIndex = null;

    if (CONFIG.block.staticColor) {
      colorIndex = type.color;
    } else {
      (function getNonRepetitiveColor() {
        colorIndex = _getRandomColorIndex();
        if (Object.keys(COLOR_MAP).length === 1) return;
        if (colorIndex === _lastColorIndex) {
          getNonRepetitiveColor();
        }
      })();
    }

    _lastColorIndex = colorIndex;

    return new Shape(typeName, matrix, colorIndex);
  }

  function _getRandomTypeName() {
    var typesArr = Object.keys(SHAPE_TYPES);
    return getRandomIndex(typesArr);
  }

  function _getRandomMatrix(type) {
    var matrix = type.matrix.clone();
    var randomNum = Math.floor(
      Math.random() * 4
    ) + 1;

    while(randomNum--) rotateMatrixToRight(matrix);
    return matrix;
  }

  function _getRandomColorIndex() {
    return getRandomPropName(COLOR_MAP);
  }

  // Public Functions
  this.init = function () {
    // Load Elements
    _tableElem = document.getElementById("game-table");
    _pauseBtnIconElem = document.querySelector("#game-toggle-pause-btn .fa");

    var tableCols = CONFIG.table.cols;
    var tableRows = CONFIG.table.rows;
    var pixelSize = CONFIG.pixel.size;

    _tableElem.style.width = (tableCols * pixelSize) + 4 + "px";
    _tableElem.style.height = (tableRows * pixelSize) + 4 + "px";

    for (var y = 0; y < tableRows; y++) {
      for (var x = 0; x < tableCols; x++) {
        var pixel = _makePixel(x, y);
        _tableElem.appendChild(pixel);
      }
    }

    // Paint The Danger Row
    TABLE.iterateRowPixels(0, function (x) {
      var pixel = new Pixel(x, 0);
      pixel.addClass("game-danger-row-pixel");
      return true;
    });

    TABLE.show();
    NEXT.push(_getRandomShape());

    // Currect the toggler button icon
    toggleSoundFX();
    toggleSoundFX();

    LOADING.endLoading();
  }

  this.renderFrame = function () {
    var gameFrameRate = _isSpeed ? _speedFrameRate : _frameRate;

    if (IS_PAUSED || IS_CALCING) {
      _setMainTimeout(_self.renderFrame, gameFrameRate);
      return;
    }

    _handShape.moveDown(_stopCallback);
    _setMainTimeout(_self.renderFrame, gameFrameRate);
  }

  this.getNewShape = function () {
    _handShape = NEXT.pop();
    NEXT.push(_getRandomShape());
    _handShape.paint();
  };

  this.resume = function () {
    IS_PAUSED = false;
    GENERAL_STATUS.resume();
    _pauseBtnIconElem.classList.add("fa-pause");
    _pauseBtnIconElem.classList.remove("fa-play");
  };

  this.pause = function () {
    IS_PAUSED = true;
    GENERAL_STATUS.pause();
    _pauseBtnIconElem.classList.add("fa-play");
    _pauseBtnIconElem.classList.remove("fa-pause");
  };

  this.togglePause = function () {
    if (GAME_OVER) return;
    IS_PAUSED ? _self.resume() : _self.pause();
  };

  this.speedItUp = function () {
    if (_isSpeed) return;
    _isSpeed = true;
    clearTimeout(_mainFrameTimeout);
    _self.renderFrame();
  };

  this.speedItDown = function () {
    if (!_isSpeed) return;
    _isSpeed = false;
    clearTimeout(_mainFrameTimeout);
    _self.renderFrame();
  };

  this.restart = function () {
    GAME_OVER = false;
    TABLE.eraseAll();
    if (!LIFE.get()) {
      SCORE.reset();
      LIFE.reset();
    }
    HOLD.empty();
    NEXT.empty();
    NEXT.push(_getRandomShape());
    _self.getNewShape();
    _self.resume();
  };

  this.backToStart = function () {
    GAME_OVER = false;
    _self.pause();
    GENERAL_STATUS.start();
    TABLE.eraseAll();
    SCORE.reset();
    LIFE.reset();
    HOLD.empty();
    NEXT.empty();
    NEXT.push(_getRandomShape());
    _frameRate = CONFIG.start.speed;
    _self.getNewShape();
  };

  this.moveRight = function () {
    if (!_handShape) return;
    _handShape.moveRight();
  };

  this.moveLeft = function () {
    if (!_handShape) return;
    _handShape.moveLeft();
  };

  this.rotateRight = function () {
    if (!_handShape) return;
    _handShape.rotateRight();
    SOUND_FX.rotate();
  }

  this.rotateLeft = function () {
    if (!_handShape) return;
    _handShape.rotateLeft();
    SOUND_FX.rotate();
  };
  
  this.hold = function () {
    if (HOLD.isLocked()) return;
    var holdShape = HOLD.getShape();
    if (!holdShape) holdShape = _getRandomShape();
    holdShape.setX(_handShape.getX());
    holdShape.setY(_handShape.getY());
    if (!holdShape.isDrawable()) return;
    _handShape.erase();
    HOLD.hold(_handShape);
    HOLD.lock();
    _handShape = holdShape;
    _handShape.paint();
  };

})();

function togglePause() {
  var iconElem = document.querySelector("#game-toggle-pause-btn > .fa");

  GAME.togglePause();
  iconElem.classList[IS_PAUSED ? "add" : "remove"]("fa-play");
  iconElem.classList[IS_PAUSED ? "remove" : "add"]("fa-pause");
  blurBtn(this);
}

function restartGame() {
  GAME.backToStart();
  blurBtn(this);
}
