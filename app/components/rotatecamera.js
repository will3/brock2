var THREE = require('three');
var clamp = require('../utils/math').clamp;

var RotateCamera = function($window, $input) {
  this.isDrag = false;
  this.lastX = 0;
  this.lastY = 0;
  this.camera = null;
  this.target = new THREE.Vector3();
  this.rotation = new THREE.Euler(-Math.PI / 4, Math.PI / 4, 0);
  this.rotation.order = 'YXZ';
  this.distance = 100;

  this._mousedown = null;
  this._mouseup = null;
  this._mousemove = null;
  this._mouseenter = null;
  this._mouseleave = null;
  this.window = $window;
  this.input = $input;
};

RotateCamera.$inject = ['$window', '$input'];

RotateCamera.prototype = {
  constructor: RotateCamera,

  start: function() {
    this.camera = this.object;
    this.updatePosition();
  },

  tick: function() {
    if (this.input.mouseDown(0)) {
      this.isDrag = true;
    }

    if (this.input.mouseUp(0)) {
      this.isDrag = false;
    }

    if (this.input.mouseEnter) {
      this.isDrag = false;
    }

    if (this.input.mouseLeave) {
      this.isDrag = false;
    }

    if (this.isDrag) {
      var xDiff = this.input.mouseX - this.lastX;
      var yDiff = this.input.mouseY - this.lastY;
      this.rotation.x += yDiff * 0.01;
      this.rotation.y += xDiff * 0.01;
      this.rotation.x = clamp(this.rotation.x, -Math.PI / 2, Math.PI / 2);

      this.updatePosition();
    }

    this.lastX = this.input.mouseX;
    this.lastY = this.input.mouseY;
  },

  updatePosition: function() {
    var vector = new THREE.Vector3(0, 0, 1)
      .applyEuler(this.rotation)
      .setLength(this.distance)
      .add(this.target);

    this.camera.position.copy(vector);
    this.camera.lookAt(this.target);
  }
};

module.exports = RotateCamera;