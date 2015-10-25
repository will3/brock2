var THREE = require('three');

var YIndicator = function(cache) {
  this.cache = cache;
  this.position = new THREE.Vector3(0, 100, 0);
};

YIndicator.$inject = ['cache'];

YIndicator.prototype = {
  constructor: YIndicator,

  start: function() {
    var geometry = this.cache.geometries['yindicator'];
    if (geometry === undefined) {
      geometry = this.cache.geometries['yindicator'] =
        new THREE.Geometry();
      geometry.vertices.push(new THREE.Vector3(), new THREE.Vector3(0, 1, 0));
    }

    var material = this.cache.materials['yindicator'];
    if (material === undefined) {
      material = this.cache.materials['yindicator'] =
        new THREE.LineBasicMaterial({
          transparent: true,
          opacity: 0.5,
          color: 0xffffff
        });
    }

    this.objLine = new THREE.Line(geometry, material);
    this.object.add(this.objLine);
  },

  tick: function() {
    var yScale = this.position.y;

    this.objLine.position.x = this.position.x;
    this.objLine.position.z = this.position.z;
    this.objLine.scale.y = this.position.y;
  },

  destroy: function() {
    this.objLine.parent.remove(this.objLine);
  }
};

module.exports = YIndicator;