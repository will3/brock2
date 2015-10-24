module.exports = function($window) {
  var mouseX = 0;
  var mouseY = 0;
  var mousedowns = [];
  var mouseups = [];
  var mouseenter = false;
  var mouseleave = false;

  var mousedownListener = function(e) {
    mousedowns.push(e.button);
  };

  var mouseupListener = function(e) {
    mouseups.push(e.button);
  };

  var mousemoveListener = function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  };

  var mouseenterListener = function() {
    mouseenter = true;
  };

  var mouseleaveListener = function() {
    mouseleave = true;
  };

  return {
    start: function() {
      $window.addEventListener('mousedown', mousedownListener);

      $window.addEventListener('mouseup', mouseupListener);
      $window.addEventListener('mousemove', mousemoveListener);
      $window.addEventListener('mouseenter', mouseenterListener);
      $window.addEventListener('mouseleave', mouseleaveListener);
    },

    lateTick: function() {
      this.mousedowns = [];
      this.mouseups = [];
      this.mouseenter = false;
      this.mouseleave = false;
    },

    destroy: function() {
      $window.removeEventListener('mousedown', mousedownListener);
      $window.removeEventListener('mouseup', mouseupListener);
      $window.removeEventListener('mousemove', mousemoveListener);
      $window.removeEventListener('mouseenter', mouseenterListener);
      $window.removeEventListener('mouseleave', mouseleaveListener);
    },

    mouseDown: function(button) {
      return mousedowns.filter(function(b) {
        return b === button;
      }).length > 0;
    },

    mouseUp: function(button) {
      return mouseups.filter(function(b) {
        return b === button;
      }).length > 0;
    },

    get mouseX() {
      return mouseX;
    },

    get mouseY() {
      return mouseY;
    }
  }
};

module.exports.$inject = ['$window'];