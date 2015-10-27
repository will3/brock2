var THREE = require('three');
var clamp = require('../utils/math').clamp;

var RotateCamera = function($window, $mouse, $keyboard) {
  this.isDrag = false;
  this.lastX = 0;
  this.lastY = 0;
  this.camera = null;
  this.target = new THREE.Vector3();
  this.rotation = new THREE.Euler(-Math.PI * 0.4 , Math.PI / 4, 0);
  this.rotation.order = 'YXZ';
  this.distance = 100;
  this.moveSpeed = 5;
  this.cameraSpringFactor = 0.5;

  this._currentTarget = new THREE.Vector3();
  this._mousedown = null;
  this._mouseup = null;
  this._mousemove = null;
  this._mouseenter = null;
  this._mouseleave = null;
  this.window = $window;
  this.mouse = $mouse;
  this.keyboard = $keyboard;

  this.leftHold = false;
  this.rightHold = false;
  this.upHold = false;
  this.downHold = false;
};

RotateCamera.$inject = ['$window', '$mouse', '$keyboard'];

RotateCamera.prototype = {
  constructor: RotateCamera,

  start: function() {
    this.camera = this.object;
    this.updatePosition();
  },

  tick: function() {
    if (this.mouse.mouseDown(0)) {
      this.isDrag = true;
    }

    if (this.mouse.mouseUp(0)) {
      this.isDrag = false;
    }

    if (this.mouse.mouseEnter) {
      this.isDrag = false;
    }

    if (this.mouse.mouseLeave) {
      this.isDrag = false;
    }

    if (this.isDrag) {
      // var xDiff = this.mouse.mouseX - this.lastX;
      // var yDiff = this.mouse.mouseY - this.lastY;
      // this.rotation.x += yDiff * 0.01;
      // this.rotation.y += xDiff * 0.01;
      // this.rotation.x = clamp(this.rotation.x, -Math.PI / 2, Math.PI / 2);
    }

    this.lastX = this.mouse.mouseX;
    this.lastY = this.mouse.mouseY;

    if (this.keyboard.keyDown('w')) this.upHold = 1;
    if (this.keyboard.keyUp('w')) this.upHold = 0;
    if (this.keyboard.keyDown('s')) this.downHold = 1;
    if (this.keyboard.keyUp('s')) this.downHold = 0;
    if (this.keyboard.keyDown('d')) this.rightHold = 1;
    if (this.keyboard.keyUp('d')) this.rightHold = 0;
    if (this.keyboard.keyDown('a')) this.leftHold = 1;
    if (this.keyboard.keyUp('a')) this.leftHold = 0;

    var verticalAxis = this.upHold - this.downHold;
    var horizontalAxis = this.rightHold - this.leftHold;

    var forward = new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(0, this.rotation.y, 0));
    var right = new THREE.Vector3(1, 0, 0).applyEuler(new THREE.Euler(0, this.rotation.y, 0));

    this.target
      .add(forward.multiplyScalar(verticalAxis * this.moveSpeed))
      .add(right.multiplyScalar(horizontalAxis * this.moveSpeed));

    if (this.keyboard.keyDown('=')) {
      this.distance /= 1.1;
    }

    if (this.keyboard.keyDown('-')) {
      this.distance *= 1.1;
    }

    this.updatePosition();
  },

  updatePosition: function() {
    this._currentTarget = this.target.clone()
      .sub(this._currentTarget)
      .multiplyScalar(this.cameraSpringFactor)
      .add(this._currentTarget);

    var vector = new THREE.Vector3(0, 0, 1)
      .applyEuler(this.rotation)
      .setLength(this.distance)
      .add(this._currentTarget);

    this.camera.position.copy(vector);
    this.camera.lookAt(this._currentTarget);
  }
};

module.exports = RotateCamera;