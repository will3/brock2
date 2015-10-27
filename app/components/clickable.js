var Clickable = function(mouseEventManager) {
  this.mouseEventManager = mouseEventManager;
  this.getObjectFunc = null;
};

Clickable.$inject = ['mouseEventManager'];

Clickable.prototype = {
  constructor: Clickable,

  start: function() {
    this.mouseEventManager.addClickable(this);
  },

  destroy: function() {
    this.mouseEventManager.removeClickable(this);
  }
};

module.exports = Clickable;