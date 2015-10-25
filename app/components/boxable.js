var toScreenPosition = require('../utils/toscreenposition');
var assert = require('../utils/assert');

var Boxable = function(cache, uiState) {
  this.cache = cache;
  this.uiState = uiState;

  this.camera = null;
  this.renderer = null;

  this.x = null;
  this.y = null;
};

Boxable.$inject = ['cache', 'uiState'];

Boxable.prototype = {
  constructor: Boxable,

  start: function() {
    this.camera = this.cache['mainCamera'];
    this.renderer = this.cache['mainRenderer'];

    assert.exists(this.camera, 'camera');
    assert.exists(this.renderer, 'renderer');

    this.uiState.addBoxable(this);
  },

  tick: function() {
    var position = this.object.position;
    var screenCoord = toScreenPosition(position, this.renderer, this.camera);
    this.x = screenCoord.x;
    this.y = screenCoord.y;
  },

  destroy: function() {
    this.uiState.removeBoxable(this);
  }
};

module.exports = Boxable;