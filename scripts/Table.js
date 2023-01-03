"use strict";

var TABLE = new (function () {
  var _self = this;
  var _elem = document.getElementById("game-table");

  // Private Functions
  function _iterateRowPixels(y, cb) {
    for (var x = 0; x < CONFIG.table.cols; x++) {
      if (!cb(x, y)) return;
    }
  }

  function _iterateAllPixels(cb) {
    for (var y = 0; y < CONFIG.table.rows; y++) {
      for (var x = 0; x < CONFIG.table.cols; x++) {
        if (!cb(x, y)) return;
      }
    }
  }

  function _countBottomEmptyRows(y) {
    var count = 0;
    y++;
    for (; y < CONFIG.table.rows; y++) {
      if (_self.isRowEmpty(y)) {
        count++;
      }
    }
    return count;
  }

  function _eraseRowAnimated(y) {
    return new Promise(function (resolve, reject) {
      var x = 0;
      (function erasePixel(x) {
        var pixel = new Pixel(x, y);

        pixel.erase();
        delete PIXEL_MATRIX[y + "-" + x];

        if (x === CONFIG.table.cols - 1) {
          return resolve();
        }

        setTimeout(erasePixel, CONFIG.resolve.speed, ++x);
      })(x);
    });
  }

  function _putPixelDownAnimated(x, y, bottomEmptyRows) {
    return new Promise(function (resolve) {
      (function anim(x, y) {
        var nextY = y + 1;

        if (!bottomEmptyRows && !CONFIG.block.fragile) {
          return resolve();
        }
        if (PIXEL_MATRIX[nextY + "-" + x]) {
          return resolve();
        }
        if (nextY > CONFIG.table.rows - 1) {
          return resolve();
        }

        bottomEmptyRows--;
        var pixel = new Pixel(x, y);
        var nextPixel = new Pixel(x, nextY);
        var colorIndex = PIXEL_MATRIX[y + "-" + x];

        pixel.erase();
        delete PIXEL_MATRIX[y + "-" + x];

        nextPixel.paint(COLOR_MAP[colorIndex]);
        PIXEL_MATRIX[nextY + "-" + x] = colorIndex;

        setTimeout(anim, CONFIG.gravity.speed, x, nextY);
      })(x, y);
    });
  }

  function _gravityOnAnimated(y) {
    return new Promise(function (resolve) {
      var promiseQ = new PromiseQueue();
      var bottomEmptyRows = _countBottomEmptyRows(y);

      for (; y > 0; y--) {
        if (_self.isRowEmpty(y)) break;
        if (y + 1 === CONFIG.table.rows) continue;
        
        for (var x = 0; x < CONFIG.table.cols; x++) {
          var killPromise = promiseQ.add();
          _putPixelDownAnimated(x, y, bottomEmptyRows).then(killPromise);
        }
      }

      promiseQ.wait().then(resolve);
    });
  }

  function _resolveRow(y) {
    return new Promise(function (resolve) {
      _eraseRowAnimated(y)
        .then(function () {
          setTimeout(function () {
            _gravityOnAnimated(--y)
              .then(function () {
                if (!CONFIG.block.fragile) {
                  return resolve(0);
                }
                _self.checkForResolvableRows(false)
                  .then(resolve);
              });
          }, CONFIG.gravity.delay);
        });
    });
  }

  // Public Functions
  this.show = function () {
    _elem.style.display = "block"
  };

  this.hide = function () {
    _elem.style.display = "none";
  };

  this.isRowEmpty = function (y) {
    var empty = true;

    _iterateRowPixels(y, function (x) {
      return PIXEL_MATRIX[y + "-" + x]
        ? (empty = false)
        : true;
    });

    return empty;
  };

  this.isRowFull = function (y) {
    var full = true;

    _iterateRowPixels(y, function (x) {
      return PIXEL_MATRIX[y + "-" + x]
        ? true
        : (full = false);
    });

    return full;
  };

  this.iterateRowPixels = _iterateRowPixels;

  this.eraseAll = function () {
    _iterateAllPixels(function (x, y) {
      (new Pixel(x, y)).erase();
      delete PIXEL_MATRIX[y + "-" + x];
      return true;
    });
  };

  this.checkForResolvableRows = function (changeCalcFlag) {
    return new Promise(function (resolve) {
      if (changeCalcFlag === undefined) {
        changeCalcFlag = true;
      }
      var rows = CONFIG.table.rows;
      var promiseQ = new PromiseQueue();
      var resolvableRowsCount = 0;
      var resolvedRowsCount = 0;

      for (var y = rows - 1; y > -1; y--) {
        if (_self.isRowEmpty(y)) {
          break;
        }
        if (!_self.isRowFull(y)) {
          continue;
        }

        if (changeCalcFlag) IS_CALCING = true;
        resolvableRowsCount++;

        var killPromise = promiseQ.add();
        _resolveRow(y).then((function(killPromise) {
          return function (resRowsCount) {
            resolvedRowsCount += 1 + resRowsCount;
            killPromise();
          };
        })(killPromise));
      }

      if (resolvableRowsCount) {
        SOUND_FX["resolve" + (
          resolvableRowsCount <= 4
            ? resolvableRowsCount
            : 4
        )]();
        SCORE.add(
          resolvableRowsCount * CONFIG.resolve.price
        );
      }

      promiseQ.wait().then(function () {
        if (changeCalcFlag) IS_CALCING = false;
        resolve(resolvedRowsCount);
      });
    });
  };
  
})();
