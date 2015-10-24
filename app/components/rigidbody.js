var THREE = require('three');

var RigidBody = function() {
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
};

RigidBody.prototype = {
  constructor: RigidBody,

  tick: function() {
    this.velocity.add(this.acceleration);
    this.velocity.multiplyScalar(this.friction);
    this.object.position.add(this.velocity);
    this.acceleration.set(0, 0, 0);

    this.rotationSpeed.x += this.rotationAcceleration.x;
    this.rotationSpeed.y += this.rotationAcceleration.y;
    this.rotationSpeed.z += this.rotationAcceleration.z;

    this.rotationSpeed.x *= this.rotationFriction;
    this.rotationSpeed.y *= this.rotationFriction;
    this.rotationSpeed.z *= this.rotationFriction;

    this.object.rotation.x += this.rotationSpeed.x;
    this.object.rotation.y += this.rotationSpeed.y;
    this.object.rotation.z += this.rotationSpeed.z;

    this.rotationAcceleration.set(0, 0, 0);
  },

  applyForce: function(force) {
    //immovable
    if (this.mass === Number.POSITIVE_INFINITY) {
      return;
    }
    var acceleration = force.clone().multiplyScalar(1 / this.mass);
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
  }
};

module.exports = RigidBody;