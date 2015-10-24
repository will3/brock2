var Injector = function() {
  this.bindings = {};
  this.cache = {};
};

var Scope = {
  Normal: 0,
  Singleton: 1
};

Injector.prototype = {
  constructor: Injector,

  bind: function(type, func, deps, scope) {
    if (typeof type !== 'string') {
      throw new Error('expect string for type, but got: ', type);
    }
    this.bindings[type] = {
      func: func,
      deps: deps || [],
      scope: scope || Scope.Normal
    };
  },

  get: function(type) {
    var binding = this.bindings[type];

    if (binding === undefined) {
      throw new Error('binding not found for type: ' + type);
    }

    if (binding.scope === Scope.Singleton) {
      var instance = this.cache[type];
      if (instance !== undefined) {
        return instance;
      }
    }

    var deps = [];
    for (var i = 0; i < binding.deps.length; i++) {
      var dep = this.get(binding.deps[i]);
      deps.push(dep);
    }

    var instance = binding.func.apply(null, deps);

    if (binding.scope === Scope.Singleton) {
      this.cache[type] = instance;
    }

    return instance;
  }
};

Injector.Scope = Scope;
module.exports = Injector;