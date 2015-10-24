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

  hasComponent: function(type) {
    return this._game.hasComponent(this.object, type);
  },

  getComponent: function(type) {
    return this._game.getComponent(this.object, type);
  },

  attachComponent: function(type) {
    this._game.attachComponent(this.object, type);
  },

  dettachComponent: function(type) {
    this._game.dettachComponent(this.object, type);
  }

};

module.exports = Component;