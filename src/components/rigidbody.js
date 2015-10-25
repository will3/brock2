var EventDispatcher = require('../eventdispatcher');
var THREE = require('three');

var RigidBody = function($collision) {
  this.collision = $collision;

  this.velocity = new THREE.Vector3();
  this.acceleration = new THREE.Vector3();
  this.friction = 0.98;
  this.mass = Number.POSITIVE_INFINITY;

  this.rotationSpeed = new THREE.Euler();
  this.rotationAcceleration = new THREE.Euler();
  this.rotationFriction = 0.98;
  //rotation inertia regardless of axis, a simplification
  this.rotationInertia = Number.POSITIVE_INFINITY;

  this.radius = null;
  //don't change after start
  //use setGroup instead
  this.group = null;
  this.mask = [];

  this.hasCollision = false;
};

RigidBody.$inject = ['$collision'];

RigidBody.prototype = {
  constructor: RigidBody,

  start: function() {
    this.collision.addBody(this);
  },

  tick: function(dt) {
    var timeScale = dt / 1000 * 48.0;

    this.velocity.add(this.acceleration);

    var friction = Math.pow(this.friction, timeScale);
    this.velocity.multiplyScalar(friction);
    this.object.position.add(this.velocity.clone().multiplyScalar(timeScale));
    this.acceleration.set(0, 0, 0);

    this.rotationSpeed.x += this.rotationAcceleration.x;
    this.rotationSpeed.y += this.rotationAcceleration.y;
    this.rotationSpeed.z += this.rotationAcceleration.z;

    var rotationFriction = Math.pow(this.rotationFriction, timeScale);
    this.rotationSpeed.x *= rotationFriction;
    this.rotationSpeed.y *= rotationFriction;
    this.rotationSpeed.z *= rotationFriction;

    this.object.rotation.x += this.rotationSpeed.x * timeScale;
    this.object.rotation.y += this.rotationSpeed.y * timeScale;
    this.object.rotation.z += this.rotationSpeed.z * timeScale;

    this.rotationAcceleration.set(0, 0, 0);
  },

  destroy: function() {
    this.collision.removeBody(this);
  },

  setGroup: function(value) {
    this.collision.removeBody(this);
    this.group = value;
    this.collision.addBody(this);
  },

  applyForce: function(force, immediately) {
    immediately = immediately || false;
    //immovable
    if (this.mass === Number.POSITIVE_INFINITY) {
      return;
    }

    var acceleration = force.clone().multiplyScalar(1 / this.mass);

    if (immediately) {
      this.velocity.add(acceleration);
      return;
    }

    this.acceleration.add(acceleration);
  },

  applyTorque: function(euler) {
    //immovable
    if (this.rotationInertia === Number.POSITIVE_INFINITY) {
      return;
    }

    var acceleration = euler.clone()
    acceleration.x *= 1 / this.rotationInertia;
    acceleration.y *= 1 / this.rotationInertia;
    acceleration.z *= 1 / this.rotationInertia;

    this.rotationAcceleration.x += acceleration.x;
    this.rotationAcceleration.y += acceleration.y;
    this.rotationAcceleration.z += acceleration.z;
  },

  _onCollision: function(body, result) {
    result.body = body;
    result.object = body.object;
    this.dispatchEvent('collision', result);
  }
};

EventDispatcher.prototype.apply(RigidBody.prototype);

module.exports = RigidBody;