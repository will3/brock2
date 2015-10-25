var assert = require('../utils/assert');
var THREE = require('three');

var Pilot = function() {
  this.ship = null;
  this.orbitTarget = new THREE.Vector2();
  this.orbitDistance = 30;
  this.orbitY = 0;
  this.turrents = [];
  this.fireTarget = null;

  // this.fleetId = null;
};

Pilot.prototype = {
  constructor: Pilot,

  start: function() {
    this.ship = this.getComponent('ship');
    assert.exists(this.ship, 'ship');

    this.turrents = this.getComponents('turrent');
  },

  tick: function() {
    var self = this;

    this.ship.orbit(this.orbitTarget, this.orbitDistance, this.orbitY);
  },

  move: function(point) {
    this.orbitTarget = point;
  }
};

module.exports = Pilot;