var keycode = require('keycode');
var EventDispatcher = require('../eventdispatcher');

var Keyboard = function() {
  this.keydowns = [];
  this.keyups = [];
  this.keydownListener = null;
  this.keyupListener = null;
};

Keyboard.prototype = {
  constructor: Keyboard,

  start: function() {
    var self = this;
    this.keydownListener = function(e) {
      self.keydowns.push(keycode(e));
      self.dispatchEvent('keydown', keycode(e));
    };

    this.keyupListener = function(e) {
      self.keyups.push(keycode(e));
      self.dispatchEvent('keyup', keycode(e));
    };

    document.addEventListener('keydown', this.keydownListener);
    document.addEventListener('keyup', this.keyupListener);
  },

  keyDown: function(char) {
    return this.keydowns.indexOf(char) !== -1;
  },

  keyUp: function(char) {
    return this.keyups.indexOf(char) !== -1;
  },

  lateTick: function() {
    this.keydowns = [];
    this.keyups = [];
  },

  destroy: function() {
    document.removeEventListener('keydown', this.keydownListener);
    document.removeEventListener('keyup', this.keyupListener);
  }
};

EventDispatcher.prototype.apply(Keyboard.prototype);

module.exports = Keyboard;