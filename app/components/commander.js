var THREE = require('three');
var getMouseRaycaster = require('../utils/getmouseraycaster');

var Commander = function(cache, $mouse, boxManager, mouseEventManager) {
  this.cache = cache;
  this.mouse = $mouse;
  this.boxManager = boxManager;
  this.mouseEventManager = mouseEventManager;

  this.camera = null;
  this.scene = null;
  this.ground = null;

  this.clickThreshold = 200;

  this._lastMouseDown = null;

  this.box = null;

  this.mouseHold = false;

  this.selection = {};

  this.startDrag = null;
};

Commander.$inject = ['cache', '$mouse', 'boxManager', 'mouseEventManager'];

Commander.prototype = {
  constructor: Commander,

  start: function() {

    this.camera = this.cache['mainCamera'];
    this.scene = this.cache['mainScene'];

    var geometry = this.cache.geometries['ground'];
    if (geometry === undefined) {
      var size = 99999;
      geometry = this.cache.geometries['ground'] =
        new THREE.PlaneGeometry(size, size);
      geometry.vertices.forEach(function(v) {
        v.applyEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
      });
    }

    this.ground = new THREE.Mesh(geometry);

    this.box = this.attachComponent('guiBox');
  },

  updateMouse: function() {
    var raycaster = getMouseRaycaster(this.camera, this.mouse);

    if (this.mouse.mouseDown(0)) {
      this._lastMouseDown = new Date().getTime();
      this.mouseHold = true;
      this.startDrag = new THREE.Vector3(this.mouse.mouseX, this.mouse.mouseY);
    }

    if (this.mouse.mouseUp(0)) {
      this.mouseHold = false;
      if (this._lastMouseDown !== null) {
        var diff = new Date().getTime() - this._lastMouseDown;
        if (diff < this.clickThreshold) {
          mouseClicked = true;
          //handle click
          var clicked = this.mouseEventManager.getMouseovers();
          if (clicked.length > 0) {
            console.log(clicked);
          }
          
          var result = raycaster.intersectObject(this.ground, true);
          var point = result[0].point;

          for (var id in this.selection) {
            var item = this.selection[id];
            item.pilot.move(point);
          }
        }
      }

      if (this.box.visible && !mouseClicked) {
        //handle box selection
        var self = this;
        var boxed = this.boxManager.getInBox(this.box);
        if (boxed.length > 0) {
          var pilots = boxed.map(function(boxable) {
            return self.getComponent(boxable.object, 'pilot');
          });

          this.clearSelection();

          pilots.forEach(function(pilot) {
            var waypoint = self.attachComponent(self.scene, 'waypoint');
            var waypath = self.attachComponent(self.scene, 'waypath');
            self.selection[pilot.object.id] = {
              pilot: pilot,
              waypoint: waypoint,
              waypath: waypath
            };
          });
        }
      }
    }

    if (this.mouse.mouseEnter || this.mouse.mouseLeave) {
      this.mouseHold = false;
    }

    var mouseClicked = false;

    if (this.mouseHold && !mouseClicked) {
      this.box.visible = true;

      if (this.mouse.mouseX < this.startDrag.x) {
        this.box.origin.x = this.mouse.mouseX;
        this.box.bounds.x = this.startDrag.x - this.mouse.mouseX;
      } else {
        this.box.origin.x = this.startDrag.x;
        this.box.bounds.x = this.mouse.mouseX - this.startDrag.x;
      }

      if (this.mouse.mouseY < this.startDrag.y) {
        this.box.origin.y = this.mouse.mouseY;
        this.box.bounds.y = this.startDrag.y - this.mouse.mouseY;
      } else {
        this.box.origin.y = this.startDrag.y;
        this.box.bounds.y = this.mouse.mouseY - this.startDrag.y;
      }
    } else {
      this.box.visible = false;
    }
  },

  tick: function() {
    this.updateMouse();
    this.updateSelection();
  },

  updateSelection: function() {
    for (var id in this.selection) {
      var item = this.selection[id];

      var pilot = item.pilot;
      var waypoint = item.waypoint;
      var waypath = item.waypath;

      waypoint.position = pilot.orbitTarget;
      waypath.startPoint = pilot.object.getWorldPosition();
      waypath.endPoint = pilot.orbitTarget;
      waypath.objectNeedsUpdate = true;
    }
  },

  clearSelection: function() {
    for (var id in this.selection) {
      var item = this.selection[id];

      this.dettachComponent(this.scene, item.waypoint);
      this.dettachComponent(this.scene, item.waypath);
    }

    this.selection = {};
  }
};

module.exports = Commander;