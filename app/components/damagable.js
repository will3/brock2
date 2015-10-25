var assert = require('../utils/assert');

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

      // self.applyDamage(damage, coord);

      self.removeObject(object);
    };

    this.rigidBody.addEventListener('collision', this.collisionHandler);
  },

  applyDamage: function(damage, coord) {
    // var velocity = damage.getComponent('rigidBody').velocity;
    // var position = damage.object.position;
    var map = this.blockModel.map;
    map.set(coord.x, coord.y, coord.z, 0);
    this.blockModel.chunkNeedsUpdate = true;
  },

  destroy: function() {
    this.rigidBody.removeEventListener('collision', this.collisionHandler);
  }
};

module.exports = Damagable;