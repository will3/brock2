var clamp = require('../utils/math').clamp;
var normalizeAngle = require('../utils/math').normalizeAngle;
var assert = require('../utils/assert');
var THREE = require('three');

//a ship vehicle
var Ship = function() {
  this.accelerateAmount = 0;
  this.bankAmount = 0;
  this.rigidBody = null;

  this.accelerateForce = 0.1;
  this.rollAcceleration = 0.05;
  this.rollSpeed = 0.0;
  this.rollFriction = 0.98;
  this.rollFrictionCurve = 0.1;
  this.yawRate = 0.05;

  this.forward = new THREE.Vector3(0, 0, 1);
};

Ship.prototype = {
  constructor: Ship,

  start: function() {
    this.rigidBody = this.getComponent('rigidBody');
    this.object.rotation.order = 'YXZ';
    assert.exists(this.rigidBody, 'rigidBody');
  },

  tick: function() {
    this.accelerateAmount = clamp(this.accelerateAmount, -1, 1);
    this.bankAmount = clamp(this.bankAmount, -1, 1);

    this.rigidBody.applyForce(
      this.forward.clone()
      .applyEuler(this.object.rotation)
      .multiplyScalar(this.accelerateAmount * this.accelerateForce)
    );

    this.rollSpeed += this.rollAcceleration * this.bankAmount;
    this.object.rotation.z += this.rollSpeed;
    var friction = Math.pow(Math.cos(this.object.rotation.z), this.rollFrictionCurve) *
      this.rollFriction;
    this.object.rotation.z *= friction;
    this.object.rotation.y -= Math.sin(this.object.rotation.z) * this.yawRate;
  },

  accelerate: function(amount) {
    this.accelerateAmount += amount;
  },

  bank: function(amount) {
    this.bankAmount += amount;
  },

  bankForRoll: function(roll, curve, curve2) {
    curve = curve || 0.1;
    curve2 = curve2 || 0.1;
    var currentRoll = this.object.rotation.z;
    var desiredSpeed = normalizeAngle(roll - currentRoll) * curve;
    var desiredAcceleration = (desiredSpeed - this.rollSpeed) * curve2;
    this.bankAmount = clamp(desiredAcceleration / this.rollAcceleration, -1, 1);
  },

  bankForYaw: function(yaw, curve, curve2) {
    curve = curve || 0.05;
    curve2 = curve2 || 1.0;
    var currentYaw = this.object.rotation.y;
    var desiredSpeed = normalizeAngle(yaw - currentYaw) * curve;
    var desiredRoll = Math.asin(clamp(desiredSpeed / -this.yawRate, -1, 1)) * curve2;
    this.bankForRoll(desiredRoll);
  },

  align: function(point) {
    var angle = Math.atan2(
      point.x - this.object.position.x,
      point.z - this.object.position.z
    );
    this.bankForYaw(angle);
  },

  orbit: function(point, distance) {
    var angle = Math.PI / 3;

    var diff = new THREE.Vector3().subVectors(this.object.position, point);
    if (diff.length() === 0) {
      diff = new THREE.Vector3(Math.random() - 0.5, 0, Math.random() * 0.5);

    }
    diff.applyEuler(new THREE.Euler(0, angle, 0))
      .setLength(distance);
    var target = new THREE.Vector3().addVectors(point, diff);
    this.align(target);
    // this.addSprite(target, 1000);
    this.accelerate(0.1);
  },

  addSprite: function(position, ttl) {
    var material = new THREE.SpriteMaterial({
      color: 0x000000
    });
    var sprite = new THREE.Sprite(material);
    sprite.position.copy(position);
    var parent = this.object.parent;
    parent.add(sprite);
    setTimeout(function() {
      parent.remove(sprite);
    }, ttl);
  }
};

module.exports = Ship;