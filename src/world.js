var World = function() {
  this.componentMap = {};
};

World.prototype = {
  constructor: World,

  attachComponent: function(object, component) {
    var components = this.componentMap[object.id];
    if (components === undefined) {
      components = this.componentMap[object.id] = {};
    }
    components[component.type] = component;
  },

  dettachComponent: function(object, type) {
    var components = this.componentMap[object.id];
    if (components === undefined) {
      return;
    }
    delete components[type];
  },

  dettachComponents: function(object) {
    var components = this.componentMap[object.id];
    if (components === undefined) {
      return;
    }
    for (var type in components) {
      this.dettachComponent(object, type);
    }
  },

  hasComponent: function(object, type) {
    var components = this.componentMap[object.id];
    if (components === undefined) {
      return false;
    }
    return components[type] !== undefined;
  },

  getComponent: function(object, type) {
    var components = this.componentMap[object.id];
    if (components === undefined) {
      return undefined;
    }
    return components[type];
  },

  getComponents: function(object) {
    return this.componentMap[object.id];
  },

  traverse: function(callback) {
    for (var id in this.componentMap) {
      var components = this.componentMap[id];
      for (var type in components) {
        var component = components[type];
        callback(component);
      }
    }
  }
};

module.exports = World;