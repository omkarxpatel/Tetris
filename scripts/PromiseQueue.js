"use strict";

function PromiseQueue() {
  var _self = this;
  var _q = [];

  this.add = function () {
    var _qIndex = _q.length;
    _q.push(true);
    var killPromise = function () { _q[_qIndex] = false };
    return killPromise.bind(_self);
  };

  this.wait = function () {
    return new Promise(function (resolve) {
      (function waitLoop() {
        for (var i = 0; i < _q.length; i++) {
          if (_q[i]) return setTimeout(waitLoop, 10);
        }
        resolve();
      })();
    });
  };
}