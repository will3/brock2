var THREE = require('three');

var GuiBox = function(game) {
  this.game = game;
  this.renderListener = null;

  this.origin = new THREE.Vector2();
  this.bounds = new THREE.Vector2(20, 20);
  this.visible = false;
};

GuiBox.$inject = ['$game'];

GuiBox.prototype = {
  constructor: GuiBox,

  start: function() {
    var div = document.createElement('div');
    div.style.position = 'absolute';
    document.body.appendChild(div);
    div.style['border-style'] = 'solid';
    div.style['border-color'] = '#eee';
    div.style['border-width'] = 1 + 'px';
    div.style['border-opacity'] = 0.5;

    var self = this;
    this.renderListener = function() {
      var left = self.origin.x;
      var top = self.origin.y;
      if (self.bounds.x < 0) left += self.bounds.x;
      if (self.bounds.y < 0) top += self.bounds.y;
      div.style.left = left + 'px';
      div.style.top = top + 'px';
      div.style.width = Math.abs(self.bounds.x) + 'px';
      div.style.height = Math.abs(self.bounds.y) + 'px';
      div.style.visibility = self.visible ? 'visible' : 'hidden';
    };

    this.game.addEventListener('render', this.renderListener);
  },

  destroy: function() {
    this.game.removeEventListener('render', this.renderListener);
  }
};

module.exports = GuiBox;