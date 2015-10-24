var clamp = require('../utils/math').clamp;
var assert = require('../utils/assert');
var THREE = require('three');

//a ship vehicle
var Ship = function() {
  this.accelerateAmount = 0;
  this.bankAmount = 0;
  this.rigidBody = null;

  this.acceleratePower = 0.1;
  this.bankPower = 0.1;

  this.forward = new THREE.Vector3(0, 0, 1);
};

Ship.prototype = {
  constructor: Ship,

  start: function() {
    this.rigidBody = this.getComponent('rigidBody');
    assert.exists(this.rigidBody, 'rigidBody');
  },

  tick: function() {
    this.bank(1.0);
    this.accelerateAmount = clamp(this.accelerateAmount, -1, 1);
    this.bankAmount = clamp(this.bankAmount, -1, 1);

    var force = this.forward.clone()
      .applyEuler(this.object.rotation)
      .multiplyScalar(this.acceleratePower *
        clamp(this.accelerateAmount, -1, 1));

    this.rigidBody.applyForce(force);

    var bankForce = this.bankPower *
      clamp(this.bankAmount, -1, 1);

    this.rigidBody.applyTorque(new THREE.Euler(0, 0, bankForce));
  },

  accelerate: function(amount) {
    this.accelerateAmount += amount;
  },

  bank: function(amount) {
    this.bankAmount += amount;
  }
};

module.exports = Ship;