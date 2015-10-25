var assert = require('../utils/assert');
var THREE = require('three');
var toScreenPosition = require('../utils/toscreenposition');

var GuiText = function($game, cache) {
  this.game = $game;
  this.cache = cache;
  this.div = null;
  this.camera = null;
  this.renderer = null;
  this.renderListener = null;
  this.text = 'empty';
  this.position = new THREE.Vector2();
};

GuiText.$inject = ['$game', 'cache'];

GuiText.prototype = {
  constructor: GuiText,

  start: function() {
    this.camera = this.cache['mainCamera'];
    this.renderer = this.cache['mainRenderer'];

    assert.exists(this.camera, 'camera');
    assert.exists(this.renderer, 'renderer');

    var div = document.createElement('div');
    div.innerHTML = this.text;
    div.style.position = 'absolute';
    div.className = 'unselectable';
    document.body.appendChild(div);
    this.div = div;

    var self = this;
    this.renderListener = function() {
      self.onRender();
    };
    this.game.addEventListener('render', this.renderListener);
  },

  setText: function(value) {
    this.text = value;
    this.div.innerHTML = value;
  },

  onRender: function() {
    var screenPos = toScreenPosition(
      this.object.getWorldPosition(),
      this.renderer,
      this.camera
    );
    this.div.style.left = screenPos.x + this.position.x + 'px';
    this.div.style.top = screenPos.y + this.position.y + 'px';
  },

  destroy: function() {
    document.body.removeChild(this.div);
    this.game.removeEventListener('render', this.renderListener);
  }
};

module.exports = GuiText;