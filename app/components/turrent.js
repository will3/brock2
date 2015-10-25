var THREE = require('three');
var getRoot = require('../utils/getRoot');
var assert = require('../utils/assert');

var Turrent = function() {
  this.ammoType = 'laser';

  this.autoFire = false;

  this.target = null;

  this.cooldown = 400;

  this.ammo = 0;

  this.clipSize = 6;

  this.reloadTime = 1200;

  this._cooldownTimer = 0;

  this._reloadTimer = 0;

  this.rigidBody = null;
};

Turrent.prototype = {

  start: function() {
    this.rigidBody = this.getComponent('rigidBody');
    assert.exists(this.rigidBody);
  },

  fire: function(value, target) {
    this.autoFire = value;
    this.target = target || null;
  },

  tick: function(dt) {
    if (this.ammo === 0) {
      this._reloadTimer += dt;

      if (this._reloadTimer < this.reloadTime) {
        return;
      }

      this._reloadTimer = 0;
      this.ammo = this.clipSize;
      this._cooldownTimer = this.cooldown;
    }

    if (!this.autoFire) {
      return;
    }

    if (this._cooldownTimer < this.cooldown) {
      this._cooldownTimer += dt;
      return;
    }

    this._fire();
    this.ammo--;
    this._cooldownTimer = 0;
  },

  _fire: function() {
    //create ammo
    var object = new THREE.Object3D();
    var scene = getRoot(this.object);
    scene.add(object);
    var ammo = this.attachComponent(object, this.ammoType);

    var diff = new THREE.Vector3().subVectors(
      this.target.object.position,
      this.object.position
    );

    var leading = diff.length() / ammo.speed;
    var projected = new THREE.Vector3().addVectors(
      this.target.object.position,
      this.target.getComponent('rigidBody').velocity.clone().multiplyScalar(leading)
    );
    ammo.direction = projected.sub(this.object.position).normalize();
    ammo.ownerId = this.object.id;

    var radius = this.rigidBody.radius || 0;

    object.position.copy(
      this.object.getWorldPosition()
      .add(ammo.direction.clone().setLength(radius))
    );
  }
};

module.exports = Turrent;