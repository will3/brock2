var THREE = require('three');

var Fleet = function() {
  this.num = 3;
  this.spacing = 10;
  this.target = new THREE.Vector3();
  // this.waypoint = null;
  // this.waypaths = {};
  // this.yIndicators = {};
  this.pilots = {};
};

Fleet.prototype = {
  constructor: Fleet,

  start: function() {
    var scene = this.object;

    var num = this.num;
    var halfNum = num / 2;
    var step = 1;
    for (var x = 0; x < num; x++) {
      for (var z = 0; z < num; z++) {
        var object = new THREE.Object3D();
        scene.add(object);

        this.attachComponent(object, 'ship');

        var pilot = this.attachComponent(object, 'pilot');
        pilot.orbitTarget = this.target;
        pilot.orbitDistance = Math.random() * 10 + 5;
        pilot.orbitY = Math.random() * 20 - 10;
        this.pilots[pilot.id] = pilot;

        var offset = new THREE.Vector3(
          (x - halfNum + 0.5) * this.spacing,
          0, (z - halfNum + 0.5) * this.spacing);

        object.position.copy(this.target.clone().add(offset));

        // var waypath = this.attachComponent(scene, 'waypath');
        // this.waypaths[pilot.id] = waypath;

        // var yIndicator = this.attachComponent(scene, 'yIndicator');
        // this.yIndicators[pilot.id] = yIndicator;
      }
    }

    // this.waypoint = this.attachComponent(scene, 'waypoint');
    // this.waypoint.position = this.target;
  },

  tick: function() {
    for (var id in this.pilots) {
      var pilot = this.pilots[id];
      // var waypath = this.waypaths[id];
      // if (!waypath.visible) {
      // waypath.visible = true;
      // }
      // waypath.startPoint = pilot.object.getWorldPosition();
      // waypath.endPoint = this.target;
      // waypath.updateObject();

      // var yIndicator = this.yIndicators[id];
      // yIndicator.position = pilot.object.getWorldPosition();
    }
  },

  move: function(point) {
    this.target = point;

    // this.waypoint.position = this.target;
    for (var id in this.pilots) {
      var pilot = this.pilots[id];
      pilot.orbitTarget = this.target;
    }
  }
};

module.exports = Fleet;