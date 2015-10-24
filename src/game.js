var Component = require('./component');
var Injector = require('./injector');
var World = require('./world');

var Game = function() {
  this.injector = new Injector();
  this.componentMap = {};
  this.nameMap = {};
  this.world = new World();
  this.frameRate = 48.0;
  this.systems = {};
  //auto start

  this.start();
  var self = this;
  var interval = function() {
    self.tick();
    setTimeout(interval, 1000 / self.frameRate);
  };
  interval();
};

var extend = function(a, b) {
  for (var i in b) {
    a[i] = b[i];
  }
  return a;
};

var isArray = function(value) {
  return Object.prototype.toString.call(value) === '[object Array]';
};

var getFactoryFunction = function(constructor, argArray) {
  var deps = [null].concat(argArray);
  return constructor.bind.apply(constructor, deps);
};

Game.prototype = {
  constructor: Game,

  //declare component
  component: function(type, args) {
    var constructor, deps;

    if (isArray(args)) {
      constructor = args[args.length - 1];
      args.pop();
      deps = args;
    } else if (typeof args === 'function') {
      constructor = args;
      deps = constructor.$inject;
    }

    var func = function() {
      var component = Object.create(Component.prototype);

      var argArray = Array.prototype.slice.call(arguments);
      var factoryFunction = getFactoryFunction(constructor, argArray);
      var custom = new factoryFunction();

      return extend(component, custom);
    };

    this.injector.bind(type, func, deps, Injector.Scope.Normal);
  },

  //declare system
  system: function(type, args) {
    var constructor, deps;
    if (typeof args === 'array') {
      constructor = args[args.length - 1];
      args.pop();
      deps = args;
    } else if (typeof args === 'function') {
      constructor = args;
      deps = constructor.$inject;
    } else {
      throw new Error('expected array or function, but got: ' + args);
    }

    var self = this;
    var func = function() {
      var argArray = Array.prototype.slice.call(arguments);
      var factoryFunction = getFactoryFunction(constructor, argArray);
      var system = new factoryFunction();

      self.systems[type] = system;
      return system;
    };

    this.injector.bind(type, func, deps, Injector.Scope.Singleton);
  },

  attachComponent: function(object, type) {
    var component = this.injector.get(type);
    component._game = this;
    component.object = object;
    component.type = type;
    this.world.attachComponent(object, component);
    return component;
  },

  dettachComponent: function(object, type) {
    this.world.dettachComponent(object, type);
  },

  hasComponent: function(object, type) {
    return this.world.hasComponent(object, type);
  },

  getComponent: function(object, type) {
    return this.world.getComponent(object, type);
  },

  getComponents: function(object) {
    return this.world.getComponents(object);
  },

  dettachComponents: function(object) {
    this.world.dettachComponents(object);
  },

  start: function() {
    //load default systems
    this.system('$window', require('./systems/window'));
  },

  tick: function() {
    for (var type in this.systems) {
      var system = this.systems[type];
      if (!system._started) {
        if (system.start !== undefined) system.start();
        system._started = true;
      }
      if (system.tick !== undefined) system.tick();
    }
    this.world.traverse(function(component) {
      if (!component._started) {
        component.start();
        component._started = true;
      }
      component.tick();
    });
    for (var type in this.systems) {
      var system = this.systems[type];
      if (system.lateTick !== undefined) system.lateTick();
    }
    this.world.traverse(function(component) {
      component.lateTick();
    });
  }
};

module.exports = Game;