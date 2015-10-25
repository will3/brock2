var THREE = require('three');

var ShipGenerator = function() {
  this.num = 10;
  this.spacing = 10;
};

ShipGenerator.prototype = {
  constructor: ShipGenerator,

  start: function() {
    var scene = this.object;

    var num = this.num;
    var halfNum = num / 2;
    var orbitDistance = 0;
    var step = 1;
    for (var x = 0; x < num; x++) {
      for (var z = 0; z < num; z++) {
        var mesh = new THREE.Mesh();
        scene.add(mesh);

        this.attachComponent(mesh, 'blockModel');

        this.attachComponent(mesh, 'ship');

        this.attachComponent(mesh, 'turrent');

        var body = this.attachComponent(mesh, 'rigidBody');
        body.group = 'ship';
        body.mask = ['ship'];

        var shipAI = this.attachComponent(mesh, 'shipAI');
        shipAI.orbitDistance = orbitDistance;

        this.attachComponent(mesh, 'damagable');

        orbitDistance += step;
        mesh.position.set((x - halfNum + 0.5) * this.spacing, 0, (z - halfNum + 0.5) * this.spacing);
      }
    }
  }
};

module.exports = ShipGenerator;