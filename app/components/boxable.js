var toScreenPosition = require('../utils/toscreenposition');
var assert = require('../utils/assert');

var Boxable = function(cache, boxManager) {
  this.cache = cache;
  this.boxManager = boxManager;

  this.camera = null;
  this.renderer = null;

  this.x = null;
  this.y = null;
};

Boxable.$inject = ['cache', 'boxManager'];

Boxable.prototype = {
  constructor: Boxable,

  start: function() {
    this.camera = this.cache['mainCamera'];
    this.renderer = this.cache['mainRenderer'];

    assert.exists(this.camera, 'camera');
    assert.exists(this.renderer, 'renderer');

    this.boxManager.addBoxable(this);
  },

  tick: function() {
    var position = this.object.position;
    var screenCoord = toScreenPosition(position, this.renderer, this.camera);
    this.x = screenCoord.x;
    this.y = screenCoord.y;
  },

  destroy: function() {
    this.boxManager.removeBoxable(this);
  }
};

module.exports = Boxable;