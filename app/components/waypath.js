var THREE = require('three');

var Waypath = function(cache) {
  this.cache = cache;

  this.startPoint = new THREE.Vector3();
  this.endPoint = new THREE.Vector3(100, 100, 100);

  this.objectNeedsUpdate = false;

  this.geometry = null;

  this.objPath = null;

  this.visible = true;
};

Waypath.$inject = ['cache'];

Waypath.prototype = {
  constructor: Waypath,

  start: function() {
    this.updateObject();
  },

  tick: function() {
    if (this.objectNeedsUpdate) {
      this.updateObject();
      this.objectNeedsUpdate = false;
    }
  },

  updateObject: function() {
    if (this.geometry !== null) {
      this.geometry.dispose();
    }

    if (this.objPath !== null) {
      this.objPath.parent.remove(this.objPath);
    }

    var geometry = new THREE.Geometry();
    geometry.vertices.push(
      this.startPoint,
      this.endPoint
    );
    geometry.computeLineDistances();

    this.geometry = geometry;

    var material = this.cache.materials['waypath'];
    if (material === undefined) {
      material = this.cache.materials['waypath'] =
        new THREE.LineDashedMaterial({
          transparent: true,
          opacity: 0.5,
          color: 0xffffff,
          dashSize: 1,
          gapSize: 0.5
        });
    }

    this.objPath = new THREE.Line(this.geometry, material);
    this.object.add(this.objPath);
    this.objPath.visible = this.visible;
  },

  setVisible: function(value) {
    this.visible = value;
    if (this.objPath !== null) {
      this.objPath.visible = value;
    }
  },

  destroy: function() {
    if (this.objPath !== null) {
      this.objPath.parent.remove(this.objPath);
    }
  }
};

module.exports = Waypath;