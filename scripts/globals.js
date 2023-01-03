"use strict";

var PIXEL_MATRIX = {};
var IS_PAUSED = true;
var GAME_OVER = false;
var IS_CALCING = false; // Short for "IS_CALCULATING" :))))
var SOUNDFX_FLAG = true;
var IS_LOADING = false;

var KEY_ENTER = 13;
var KEY_CTRL = 17;

var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;

var KEY_D = 68;
var KEY_S = 83;
var KEY_A = 65;
var KEY_W = 87;
var KEY_E = 69;
var KEY_Q = 81;

// Thanks to https://materialuicolors.co/
var COLOR_MAP = {
  1: "#F44336", // Red
  2: "#8BC34A", // Green
  3: "#FFEB3B", // Yellow
  4: "#9C27B0", // Purple
  5: "#00BCD4", // Cyan
  6: "#03A9F4", // Blue
  7: "#FF9800", // Orange
};
var SHAPE_TYPES = {
  I: {
    color: 1, // Red
    matrix: [
      [1],
      [1],
      [1],
      [1]
    ]
  },
  O: {
    color: 3, // Yellow
    matrix: [
      [1, 1],
      [1, 1]
    ]
  },
  T: {
    color: 4, // Purple
    matrix: [
      [1, 1, 1],
      [0, 1, 0]
    ]
  },
  S: {
    color: 7, // Orange
    matrix: [
      [0, 1, 1],
      [1, 1, 0]
    ]
  },
  Z: {
    color: 6, // Pink
    matrix: [
      [1, 1, 0],
      [0, 1, 1]
    ]
  },
  J: {
    color: 5, // Cyan
    matrix: [
      [0, 1],
      [0, 1],
      [1, 1]
    ]
  },
  L: {
    color: 2, // Green
    matrix: [
      [1, 0],
      [1, 0],
      [1, 1]
    ]
  }
};
