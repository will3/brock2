var mesher = require('../voxel/monotone').mesher;
var ndarray = require('ndarray');
var THREE = require('three');
var assert = require('../utils/assert');

var BlockModel = function() {
  this.num = Math.floor(Math.random() * Math.pow(2, 15));
  this.map = ndarray(new Array(), [5, 5, 1]);
  this.rigidBody = null;
  this.min = null;
  this.max = null;
  this.springFactor = 1.0;
  this.dampFactor = 0.95;

  this.collisionListener = null;

  this.chunkNeedsUpdate = false;
};

BlockModel.prototype = {
  constructor: BlockModel,

  start: function() {
    assert(this.object instanceof THREE.Mesh);

    this.rigidBody = this.getComponent('rigidBody');

    assert.exists(this.rigidBody, 'rigidBody');

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

    this.loadMapWithNum(this.num);
    this.updateMesh();
    this.updateBounds();
    this.updateBody();
  },

  tick: function() {
    if (this.chunkNeedsUpdate) {
      this.updateMesh();
      this.updateBounds();
      this.updateBody();
      this.chunkNeedsUpdate = false;
    }
  },

  destroy: function() {
    this.rigidBody.removeEventListener('collision', this.collisionListener);
  },

  updateMesh: function() {
    var geometry = new THREE.Geometry();
    var material = new THREE.MeshBasicMaterial({
      color: 0x000000
    });

    var map = ndarray(new Array(), [7, 7, 7]);
    for (var x = 0; x < 5; x++) {
      for (var z = 0; z < 5; z++) {
        var bit = this.map.get(z, 0, x);
        if (bit === 1) {
          map.set(x + 1, 3, z + 1, bit);
        }
      }
    }
    var result = mesher(map.data, map.shape);
    geometry.vertices = result.vertices.map(function(v) {
      var vertice = new THREE.Vector3(v[0], v[1], v[2])
        .add(new THREE.Vector3(-3.5, -3.5, -3.5));
      return vertice;
    });

    geometry.faces = result.faces.map(function(f) {
      var face = new THREE.Face3(f[0], f[1], f[2]);
      return face;
    });

    this.object.geometry = geometry;
    this.object.material = material;
  },

  updateBounds: function() {
    var min, max;
    var init = false;
    this.traverse(function(item) {
      if (!init) {
        min = new THREE.Vector3(item.x, item.y, item.z);
        max = new THREE.Vector3(item.x, item.y, item.z);
        init = true;
      }

      if (min.x < item.x) min.x = item.x;
      if (min.y < item.x) min.y = item.x;
      if (min.z < item.x) min.z = item.x;

      if (max.x > item.x) max.x = item.x;
      if (max.y > item.x) max.y = item.x;
      if (max.z > item.x) max.z = item.x;
    });

    this.min = min;
    this.max = max;
  },

  updateBody: function() {
    var count = 0;
    this.traverse(function(b) {
      count++;
    });

    this.rigidBody.mass = count;
    var diff = this.max.clone().sub(this.min);
    this.rigidBody.rotationInertia =
      0.4 * this.rigidBody.mass * this.rigidBody.radius;
    this.rigidBody.radius = diff.length() / 2;
  },

  traverse: function(callback) {
    for (var x = 0; x < 5; x++) {
      for (var z = 0; z < 5; z++) {
        var block = this.map.get(x, 0, z);
        if (block === 0) {
          continue;
        }
        callback({
          x: x,
          y: 0,
          z: z,
          block: block
        });
      }
    }
  },

  loadMapWithNum: function(num) {
    for (var i = 0; i < 15; i++) {
      var bit = (num & Math.pow(2, i)) === Math.pow(2, i) ? 1 : 0;
      var x = i % 3;
      var z = Math.floor(i / 3);
      x2 = 5 - x - 1;
      this.map.set(x, 0, z, bit);
      this.map.set(x2, 0, z, bit);
    }
  },

  getCoordWithWorldPos: function(pos) {
    var coord = this.object.worldToLocal(pos)
      .add(new THREE.Vector3(3.5, 3.5, 3.5));
    coord.x = Math.round(coord.x);
    coord.y = Math.round(coord.y);
    coord.z = Math.round(coord.z);
    return coord;
  }
};

module.exports = BlockModel;