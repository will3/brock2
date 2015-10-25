var THREE = require('three');

var Laser = function() {
  this.direction = new THREE.Vector3(0, 0, 1);
  this.speed = 2;
  this.size = 2;
  this.ownerId = null;
};

Laser.prototype = {
  constructor: Laser,

  start: function() {
    var geometry = new THREE.Geometry();
    var length = this.size;
    geometry.vertices.push(
      this.direction.clone()
      .applyEuler(this.object.rotation)
      .multiplyScalar(-length),
      new THREE.Vector3()
    );
    var material = new THREE.LineBasicMaterial({
      color: 0x000000
    });

    var beam = new THREE.Line(geometry, material);
    this.object.add(beam);

    var rigidBody = this.attachComponent('rigidBody');
    rigidBody.friction = 1.0;
    rigidBody.velocity = this.direction.clone().multiplyScalar(this.speed);
    rigidBody.radius = 1.0;
    rigidBody.group = 'ammo';
    rigidBody.mask = ['ship'];

    var selfDestruct = this.attachComponent('selfDestruct');
    selfDestruct.time = 1000;

    var damage = this.attachComponent('damage');
    damage.ownerId = this.ownerId;
  }
};

module.exports = Laser;