"use strict";

function getRandomIndex(arr) {
  var randomIndex = Math.floor(
    Math.random() * arr.length
  );
  return arr[randomIndex];
}

function getRandomIndexNum(arr) {
  return Math.floor(Math.random() * arr.length);
}

function getRandomProp(obj) {
  var propsArr = Object.keys(obj);
  var randomPropName = getRandomIndex(propsArr);
  return obj[randomPropName];
}

function getRandomPropName(obj) {
  var propsArr = Object.keys(obj);
  return getRandomIndex(propsArr);
}

function rotateMatrixToRight(matrix) {
  var M = matrix.length - 1;
  var newMatrix = [];

  for (var y = 0; y < matrix[0].length; y++) {
    newMatrix.push([]);
    for (var x = 0; x < matrix.length; x++) {
      newMatrix[y][x] = matrix[M - x][y];
    }
  }
  
  matrix.length = 0;
  newMatrix.forEach(function(row) {
    matrix.push(row);
  });
  return matrix;
}

function rotateMatrixToLeft(matrix) {
  var N = matrix[0].length - 1;
  var newMatrix = [];

  for (var y = 0; y < matrix[0].length; y++) {
    newMatrix.push([]);
    for (var x = 0; x < matrix.length; x++) {
      newMatrix[y][x] = matrix[x][N - y];
    }
  }
  
  matrix.length = 0;
  newMatrix.forEach(function(row) {
    matrix.push(row);
  });
  return matrix;
}

function blurBtn(elem) {
  if (!elem) return;
  setTimeout(function() {
    elem.blur();
  });
}