"use strict";

var SOUND_FX = new (function () {

  // SoundFX Paths
  var _audio_prefix_path = "./soundFX/";
  var _audio_rotateKeys_path = "rotate_keys.WAV";
  var _audio_resolve1_path = "resolve-1.WAV";
  var _audio_resolve2_path = "resolve-2.WAV";
  var _audio_resolve3_path = "resolve-3.WAV";
  var _audio_resolve4_path = "resolve-4.WAV";

  // Private Functions
  function _makePath(audioPath) {
    return _audio_prefix_path + audioPath;
  }

  function _loadAudio(path) {
    path = _makePath(path);
    var audio = new Audio(path);
    audio.load();
    return audio;
  }

  function _playAudio(audio) {
    if (!SOUNDFX_FLAG) return;
    audio.currentTime = 0;
    audio.play();
  }

  // Loading Audios
  var rotate_sfx = _loadAudio(_audio_rotateKeys_path);
  var resolve1 = _loadAudio(_audio_resolve1_path);
  var resolve2 = _loadAudio(_audio_resolve2_path);
  var resolve3 = _loadAudio(_audio_resolve3_path);
  var resolve4 = _loadAudio(_audio_resolve4_path);

  // Public Functions
  this.rotate = function() {
    _playAudio(rotate_sfx);
  }

  this.resolve1 = function() {
    _playAudio(resolve1);
  }

  this.resolve2 = function() {
    _playAudio(resolve2);
  }

  this.resolve3 = function() {
    _playAudio(resolve3);
  }

  this.resolve4 = function() {
    _playAudio(resolve4);
  }
})();

function toggleSoundFX() {
  var iconElem = document.querySelector("#game-toggle-sound-btn > .fa");
  SOUNDFX_FLAG = !SOUNDFX_FLAG;
  iconElem.classList[SOUNDFX_FLAG ? "add" : "remove"]("fa-volume-up");
  iconElem.classList[SOUNDFX_FLAG ? "remove" : "add"]("fa-volume-off");
  blurBtn(this);
}