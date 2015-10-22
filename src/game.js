var Component = require('./component');
var types = {};

var Game = function() {
  this.componentMap = {};
  this.nameMap = {};
};

Game.prototype = {
  constructor: Game,

  attachComponent: function(object, component) {
    //create component if passed in string
    if (typeof component === 'string') {
      component = new types[component]();
    }

    var components = this.componentMap[object.id];
    if (!components) {
      components = this.componentMap[object.id] = {};
    }

    if (components[component.type] !== undefined) {
      throw new Error('component of type: ' + component.type + 'already exists in object');
    }

    component.object = object;
    component._game = this;

    components[component.type] = component;

    return component;
  },

  dettachComponent: function(component) {
    var components = this.componentMap[component.object.id];
    if (!components) {
      return;
    }
    component.destroy();
    if (typeof component === 'string') {
      delete components[component];
    } else {
      delete components[component.type];
    }
  },

  getComponent: function(object, type) {
    var components = this.componentMap[object.id];
    if (!components) {
      return undefined;
    }
    return components[type];
  },

  getComponents: function(object) {
    return this.componentMap[object.id];
  },

  register: function(type, constructor) {
    if (typeof constructor === 'function') {
      types[type] = function() {
        var component = new Component();
        component.type = type;
        var props = new constructor();
        for (var i in props) {
          component[i] = props[i];
        }
        return component;
      }
    } else {
      //merge object
      types[type] = function() {
        var component = new Component();
        component.type = type;
        for (var i in constructor) {
          component[i] = constructor[i];
        }
        return component;
      }
    }
  },

  tick: function(scene) {
    var self = this;
    scene.traverse(function(object) {
      var components = self.componentMap[object.id];
      if (!components) {
        return;
      }
      for (var type in components) {
        var component = components[type];
        if (!component.started) {
          component.start();
          component.started = true;
        }
        component.tick();
      }
    });
  },

  name: function(object, name) {
    this.nameMap[name] = object;
    if (!object.userData) {
      object.userData = {};
    }
    object.userData.name = name;
  },

  nameOf: function(object) {
    return (object.userData || {}).name;
  },

  find: function(name) {
    return this.nameMap[name];
  },

  removeObject: function(object) {
    var components = this.componentMap[object.id];
    if (components !== undefined) {
      for (var type in components) {
        var component = components[type];
        component.destroy();
      }
      delete this.componentMap[object.id];
    }

    var name = object.userData.name;
    if (name !== undefined) {
      delete this.nameMap[name];
    }

    if (!!object.parent) {
      object.parent.remove(object);
    }
  }
};

module.exports = Game;