var THREE = require('three');

var Component = function() {
  this.id = THREE.Math.generateUUID();
  this.object = null;
  this._game = null;
  this._started = false;
};

Component.prototype = {
  constructor: Component,

  start: function() {

  },

  tick: function() {

  },

  lateTick: function() {

  },

  destroy: function() {

  },

  hasComponent: function(object, type) {
    if (typeof object === 'string') {
      type = object;
      object = this.object;
    }
    return this._game.hasComponent(object, type);
  },

  getComponent: function(object, type) {
    if (typeof object === 'string') {
      type = object;
      object = this.object;
    }
    return this._game.getComponent(object, type);
  },

  attachComponent: function(object, type) {
    if (typeof object === 'string') {
      type = object;
      object = this.object;
    }
    return this._game.attachComponent(object, type);
  },

  dettachComponent: function(object, type) {
    if (typeof object === 'string') {
      type = object;
      object = this.object;
    }
    this._game.dettachComponent(object, type);
  }

};

module.exports = Component;