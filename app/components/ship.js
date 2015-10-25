var clamp = require('../utils/math').clamp;
var normalizeAngle = require('../utils/math').normalizeAngle;
var assert = require('../utils/assert');
var THREE = require('three');

//a ship vehicle
var Ship = function() {
  this.num = Math.floor(Math.random() * Math.pow(2, 15));
  this.accelerateAmount = 0;
  this.bankAmount = 0;
  this.rigidBody = null;
  this.yAmount = 0;

  this.accelerateForce = 0.1;
  this.rollAcceleration = 0.05;
  this.rollSpeed = 0.0;
  this.rollFriction = 0.98;
  this.rollFrictionCurve = 0.1;
  this.yawRate = 0.2;
  this.ySpeed = 0.1;

  this.forward = new THREE.Vector3(0, 0, 1);

  this.collisionListener = null;

  this.springFactor = 1.0;
  this.dampFactor = 0.98;
};

Ship.prototype = {
  constructor: Ship,

  start: function() {
    this.blockModel = this.attachComponent('blockModel');
    this.attachComponent('turrent');

    this.rigidBody = this.attachComponent('rigidBody');
    this.rigidBody.group = 'ship';
    this.rigidBody.mask = ['ship'];

    this.attachComponent('damagable');

    this.loadMapWithNum(this.num);

    var self = this;
    this.collisionListener = function(collision) {
      var body = collision.body;
      var object = collision.object;
      var distance = collision.distance;

      //ship
      if (body.group === 'ship') {
        var rigidBody = body.getComponent('rigidBody');

        var total = (self.rigidBody.radius + rigidBody.radius);

        var force = new THREE.Vector3()
          .subVectors(self.object.position, object.position)
          .multiplyScalar((total - distance) * self.springFactor);

        self.rigidBody.applyForce(force, true);
        self.rigidBody.velocity.multiplyScalar(self.dampFactor);
      }
    };

    this.rigidBody.addEventListener('collision', this.collisionListener);

    this.attachComponent('boxable');
  },

  tick: function(dt) {
    var timeScale = dt / 1000 * 12.0;
    this.accelerateAmount = clamp(this.accelerateAmount, -1, 1);
    this.bankAmount = clamp(this.bankAmount, -1, 1);

    this.rigidBody.applyForce(
      this.forward.clone()
      .applyEuler(this.object.rotation)
      .multiplyScalar(this.accelerateAmount * this.accelerateForce * timeScale)
    );

    this.rollSpeed += this.rollAcceleration * this.bankAmount;
    this.object.rotation.z += this.rollSpeed * timeScale;
    var friction = Math.pow(Math.cos(this.object.rotation.z), this.rollFrictionCurve) *
      this.rollFriction;
    friction = Math.pow(friction, timeScale);
    this.object.rotation.z *= friction;
    this.object.rotation.y -= Math.sin(this.object.rotation.z) * this.yawRate * timeScale;

    this.object.position.y += this.yAmount * this.ySpeed * timeScale;
  },

  destroy: function() {
    this.rigidBody.removeEventListener('collision', this.collisionListener);
  },

  accelerate: function(amount) {
    this.accelerateAmount += amount;
  },

  bank: function(amount) {
    this.bankAmount += amount;
  },

  bankForRoll: function(roll, curve, curve2) {
    curve = curve || 0.2;
    curve2 = curve2 || 0.2;
    var currentRoll = this.object.rotation.z;
    var desiredSpeed = normalizeAngle(roll - currentRoll) * curve;
    var desiredAcceleration = (desiredSpeed - this.rollSpeed) * curve2;
    this.bankAmount = clamp(desiredAcceleration / this.rollAcceleration, -1, 1);
  },

  bankForYaw: function(yaw, curve, curve2) {
    curve = curve || 0.1;
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

  orbit: function(point, distance, relativeY) {
    relativeY = relativeY || 0;
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
    this.reachY(point.y + relativeY);
  },

  reachY: function(y, curve) {
    curve = curve || 0.1;
    var desiredSpeed = (y - this.object.position.y) * curve;
    this.yAmount = clamp(desiredSpeed / this.ySpeed, -1, 1);
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
  },

  loadMapWithNum: function(num) {
    for (var i = 0; i < 15; i++) {
      var bit = (num & Math.pow(2, i)) === Math.pow(2, i) ? 1 : 0;
      var x = i % 3;
      var z = Math.floor(i / 3);
      x2 = 5 - x - 1;

      this.blockModel.map.set(x, 0, z, bit);
      this.blockModel.map.set(x2, 0, z, bit);
    }

    this.blockModel.chunkNeedsUpdate = true;
  },
};

module.exports = Ship;