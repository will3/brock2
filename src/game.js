var Component = require('./component');
var Injector = require('./injector');
var World = require('./world');
var EventDispatcher = require('./eventdispatcher');

var Game = function() {
  this.injector = new Injector();
  this.componentMap = {};
  this.nameMap = {};
  this.world = new World();
  this.frameRate = 36.0;
  this.systems = {};
  this.timeScale = 1.0;
  //auto start

  this.start();

  this.startInterval();
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

  startInterval: function() {
    var self = this;
    var interval = function() {
      var frameTime = 1000 / self.frameRate;
      self.tick(frameTime * self.timeScale);
      setTimeout(interval, frameTime);
    };
    interval();
  },

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
    } else {
      throw new Error('expected array or function for args, but got: ', args);
    }

    var func = function() {
      var component = new Component();

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

  value: function(type, value) {
    this.injector.bind(type, function() {
      return value;
    }, [], Injector.Scope.Singleton);
  },

  attachComponent: function(object, type) {
    var component = this.injector.get(type);
    component._game = this;
    component.object = object;
    component.type = type;
    this.world.attachComponent(object, component);
    return component;
  },

  dettachComponent: function(object, component) {
    this.world.dettachComponent(object, component);
  },

  hasComponent: function(object, type) {
    return this.world.hasComponent(object, type);
  },

  getComponent: function(object, type) {
    return this.world.getComponent(object, type);
  },

  getComponents: function(object, type) {
    return this.world.getComponents(object, type);
  },

  dettachComponents: function(object) {
    this.world.dettachComponents(object);
  },

  removeObject: function(object) {
    object.parent.remove(object);
    this.dettachComponents(object);
  },

  start: function() {
    var self = this;
    this.value('$game', this);
    //load default systems
    this.system('$window', require('./systems/window'));
    this.system('$time', require('./systems/time'));
    this.system('$mouse', require('./systems/mouse'));
    this.system('$keyboard', require('./systems/keyboard'));
    this.system('$collision', require('./systems/collision'));
    this.component('rigidBody', require('./components/rigidbody'));
  },

  tick: function(dt) {
    for (var type in this.systems) {
      var system = this.systems[type];
      if (!system._started) {
        if (system.start !== undefined) system.start();
        system._started = true;
      }
      if (system.tick !== undefined) system.tick(dt);
    }

    this.world.traverse(function(component) {
      if (!component._started) {
        component.start();
        component._started = true;
      }
      component.tick(dt);
    });

    for (var type in this.systems) {
      var system = this.systems[type];
      if (system.lateTick !== undefined) system.lateTick();
    }

    this.world.traverse(function(component) {
      component.lateTick();
    });
  },

  onRender: function() {
    this.dispatchEvent('render');
  }
};

EventDispatcher.prototype.apply(Game.prototype);

module.exports = Game;