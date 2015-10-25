var THREE = require('three');

var Laser = function(cache) {
  this.direction = new THREE.Vector3(0, 0, 1);
  this.speed = 2;
  this.size = 2;
  this.ownerId = null;

  this.geometry = null;
  this.cache = cache;
};

Laser.$inject = ['cache'];

Laser.prototype = {
  constructor: Laser,

  start: function() {
    this.geometry = new THREE.Geometry();
    var length = this.size;
    this.geometry.vertices.push(
      this.direction.clone()
      .applyEuler(this.object.rotation)
      .multiplyScalar(-length),
      new THREE.Vector3()
    );

    var materials = this.cache['materials'];
    var material = materials['laser'];
    if (material === undefined) {
      material = materials['laser'] = new THREE.LineBasicMaterial({
        color: 0xBBBBBB
      });
    }

    var line = new THREE.Line(this.geometry, material);
    this.object.add(line);

    var rigidBody = this.attachComponent('rigidBody');
    rigidBody.friction = 1.0;
    rigidBody.velocity = this.direction.clone().multiplyScalar(this.speed);
    rigidBody.radius = 1.0;
    rigidBody.group = 'ammo';
    rigidBody.mask = ['ship'];

    var selfDestruct = this.attachComponent('selfDestruct');
    selfDestruct.time = 5000;

    var damage = this.attachComponent('damage');
    damage.ownerId = this.ownerId;
  },

  destroy: function() {
    this.geometry.dispose();
  }
};

module.exports = Laser;