var assert = require('../utils/assert');
var THREE = require('three');
var getRoot = require('../utils/getroot');

var Damagable = function() {
  this.rigidBody = null;
  this.blockModel = null;
  this.collisionHandler = null;
};

Damagable.prototype = {
  constructor: Damagable,

  start: function() {
    this.rigidBody = this.getComponent('rigidBody');
    this.blockModel = this.getComponent('blockModel');

    assert.exists(this.rigidBody);
    assert.exists(this.blockModel);

    var self = this;
    this.collisionHandler = function(collision) {
      var object = collision.object;
      var damage = self.getComponent(object, 'damage');

      if (!damage) {
        return;
      }

      if (damage.ownerId === this.object.id) {
        return;
      }

      var coord = self.blockModel.getCoordWithWorldPos(object.position);

      var b = self.blockModel.map.get(coord.x, coord.y, coord.z);

      if (b === 0) {
        return;
      }

      self.removeObject(object);

      // var guiObject = new THREE.Object3D();
      // guiObject.position.copy(self.object.getWorldPosition());
      // var scene = getRoot(self.object);
      // scene.add(guiObject);

      // var guiText = self.attachComponent(guiObject, 'guiText');
      // guiText.text = 'ow';

      // var selfDestruct = self.attachComponent(guiObject, 'selfDestruct');
      // selfDestruct.time = 1000;

    };

    this.rigidBody.addEventListener('collision', this.collisionHandler);
  },

  applyDamage: function(damage, coord) {
    var map = this.blockModel.map;
    map.set(coord.x, coord.y, coord.z, 0);
    this.blockModel.chunkNeedsUpdate = true;
  },

  destroy: function() {
    this.rigidBody.removeEventListener('collision', this.collisionHandler);
  }
};

module.exports = Damagable;