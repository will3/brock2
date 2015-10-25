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
    components[component.id] = component;
  },

  dettachComponent: function(object, component) {
    var components = this.componentMap[object.id];
    if (components === undefined) {
      return;
    }

    if (typeof component === 'string') {
      component = this.getComponent(component);
    }

    component.destroy();
    
    delete components[component.id];
  },

  dettachComponents: function(object) {
    var components = this.componentMap[object.id];
    if (components === undefined) {
      return;
    }
    for (var id in components) {
      this.dettachComponent(object, components[id]);
    }
  },

  hasComponent: function(object, type) {
    var components = this.componentMap[object.id];
    if (components === undefined) {
      return false;
    }
    for (var id in components) {
      var component = components[id];
      if (component.type === type) {
        return true;
      }
    }
    return false;
  },

  getComponent: function(object, type) {
    var components = this.componentMap[object.id];
    if (components === undefined) {
      return undefined;
    }
    for (var id in components) {
      var component = components[id];
      if (component.type === type) {
        return component;
      }
    }
    return undefined;
  },

  getComponents: function(object, type) {
    var components = this.componentMap[object.id];

    var list = [];
    for (var id in components) {
      var component = components[id];
      if (type === undefined || component.type === type) {
        list.push(component);
      }
    }
    return list;
  },

  traverse: function(callback) {
    for (var id in this.componentMap) {
      var components = this.componentMap[id];
      for (var id in components) {
        var component = components[id];
        callback(component);
      }
    }
  }
};

module.exports = World;