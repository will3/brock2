var getMouseRaycaster = require('../utils/getmouseraycaster');
var assert = require('../utils/assert');

var MouseEventManager = function($mouse, cache) {
  this.mouse = $mouse;
  this.cache = cache;

  this.camera = null;

  this.clickables = {};
};

MouseEventManager.$inject = ['$mouse', 'cache'];

MouseEventManager.prototype = {
  start: function() {
    this.camera = this.cache['mainCamera'];
    assert.exists(this.camera);
  },

  addClickable: function(component) {
    this.clickables[component.object.id] = component;
  },

  removeClickable: function(component) {
    delete this.clickables[component.object.id];
  },

  getMouseovers: function() {
    var raycaster = getMouseRaycaster(this.camera, this.mouse);
    var objs = [];

    var map = {};
    for (var id in this.clickables) {
      var clickable = this.clickables[id];
      var object = clickable.getObjectFunc === null ?
        clickable.object :
        clickable.getObjectFunc();
      objs.push(object);
      map[object.id] = clickable;
    }

    var self = this;
    return raycaster.intersectObjects(objs).map(function(item) {
      return {
        object: item.object,
        clickable: map[object.id]
      }
    });
  }
};

module.exports = MouseEventManager;