var THREE = require('three');

var Waypoint = function(cache) {
  this.cache = cache;

  this.objWaypoint = null;
  this.position = new THREE.Vector3();
};

Waypoint.$inject = ['cache'];

Waypoint.prototype = {
  constructor: Waypoint,

  start: function() {
    var texture = this.cache.textures['waypoint'];
    if (texture === undefined) {
      var loader = new THREE.TextureLoader();
      texture = this.cache.textures['waypoint'] =
        loader.load('assets/textures/pointer1.png');
    }

    var material = this.cache.materials['waypoint'];
    if (material === undefined) {
      material = this.cache.materials['waypoint'] =
        new THREE.MeshBasicMaterial({
          transparent: true,
          alphaMap: texture
        });
    }

    var geometry = this.cache.geometries['waypoint'];
    if (geometry === undefined) {
      var size = 4;
      geometry = this.cache.geometries['waypoint'] =
        new THREE.PlaneGeometry(size, size);
      geometry.vertices.forEach(function(v) {
        v.applyEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
      });
    }

    var object = new THREE.Mesh(geometry, material);
    object.rotation.order = 'YXZ';
    this.objWaypoint = object;
    this.objWaypoint.position.copy(this.position);

    this.object.add(this.objWaypoint);
  },

  tick: function() {
    this.objWaypoint.rotation.y += 0.02;
    this.objWaypoint.position.copy(this.position);
  },

  destroy: function() {
    if (this.objWaypoint !== null) {
      this.objWaypoint.parent.remove(this.objWaypoint);
    }
  }
};

module.exports = Waypoint;