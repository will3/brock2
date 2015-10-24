var THREE = require('three');

var RotateCamera = function($window, input) {
  this.isDrag = false;
  this.lastX = 0;
  this.lastY = 0;
  this.camera = null;
  this.target = new THREE.Vector3();
  this.rotation = new THREE.Euler(Math.PI / 4, Math.PI / 4, 0);
  this.rotation.order = 'YXZ';
  this.distance = 50;

  this._mousedown = null;
  this._mouseup = null;
  this._mousemove = null;
  this._mouseenter = null;
  this._mouseleave = null;
  this.window = $window;
  this.input = input;
};

RotateCamera.$inject = ['$window', 'input'];

var clamp = function(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

RotateCamera.prototype = {
  constructor: RotateCamera,

  start: function() {
    this.camera = this.object;

    var self = this;
    var mousedown = function() {
      self.isDrag = true;
    };
    var mouseup = function() {
      self.isDrag = false;
    };
    var mousemove = function(e) {
      if (self.isDrag) {
        var xDiff = e.clientX - self.lastX;
        var yDiff = e.clientY - self.lastY;
        self.rotation.x += yDiff * 0.01;
        self.rotation.y += xDiff * 0.01;
        self.rotation.x = clamp(self.rotation.x, -Math.PI / 2, Math.PI / 2);

        self.updatePosition();
      }

      self.lastX = e.clientX;
      self.lastY = e.clientY;
    };
    var mouseenter = function() {
      self.isDrag = false;
    };
    var mouseleave = function() {
      self.isDrag = false;
    };

    this.window.addEventListener('mousedown', mousedown);
    this.window.addEventListener('mouseup', mouseup);
    this.window.addEventListener('mousemove', mousemove);
    this.window.addEventListener('mouseenter', mouseenter);
    this.window.addEventListener('mouseleave', mouseleave);

    this._mousedown = mousedown;
    this._mouseup = mouseup;
    this._mousemove = mousemove;
    this._mouseenter = mouseenter;
    this._mouseleave = mouseleave;

    this.updatePosition();
  },

  tick: function() {
    
  },

  updatePosition: function() {
    var vector = new THREE.Vector3(0, 0, 1)
      .applyEuler(this.rotation)
      .setLength(this.distance)
      .add(this.target);

    this.camera.position.copy(vector);
    this.camera.lookAt(this.target);
  },

  destroy: function() {
    this.window.removeEventListener('mousedown', this._mousedown);
    this.window.removeEventListener('mouseup', this._mouseup);
    this.window.removeEventListener('mousemove', this._mousemove);
    this.window.removeEventListener('mouseenter', this._mouseenter);
    this.window.removeEventListener('mouseleave', this._mouseleave);
  }
};

module.exports = RotateCamera;