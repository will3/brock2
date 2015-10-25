var assert = require('../utils/assert');
var THREE = require('three');

var ShipAI = function() {
  this.ship = null;
  this.orbitDistance = 30;
  this.turrents = [];

  this.enemy = null;
};

ShipAI.prototype = {
  constructor: ShipAI,

  start: function() {
    this.ship = this.getComponent('ship');
    assert.exists(this.ship, 'ship');

    this.turrents = this.getComponents('turrent');
  },

  tick: function() {
    var self = this;

    if (this.enemy === null) {
      var ships = [];
      this.object.parent.children.forEach(function(o) {
        if (o === self.object) {
          return;
        }
        var ship = self.getComponent(o, 'ship');
        if (!!ship) {
          ships.push(ship);
        }
      });

      this.enemy = ships[Math.floor(Math.random() * ships.length)];
    }

    if (this.enemy === null) {
      return;
    }

    this.ship.orbit(this.enemy.object.position, this.orbitDistance);
    this.turrents.forEach(function(t) {
      t.fire(true, self.enemy);
    });
  }
};

module.exports = ShipAI;