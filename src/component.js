var THREE = require('three');

var Component = function() {
  this.id = THREE.Math.generateUUID();
  this.object = null;
  this._game = null;
};

Component.prototype = {
  constructor: Component,

  start: function() {

  },

  tick: function() {

  },

  destroy: function() {

  },

  getComponent: function(type) {
    return this._game.getComponent(this.object, type);
  },

  attachComponent: function(component) {
    this._game.attachComponent(this.object, component);
  },

  dettachComponent: function(component) {
    this._game.dettachComponent(component);
  },

  find: function(name) {
    return this._game.find(name);
  }

};

module.exports = Component;