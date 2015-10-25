var Time = function() {
  this.tic = require('tic')();
};

Time.prototype = {
  tick: function(dt) {
    this.tic.tick(dt);
  },

  interval: function(fn, at) {
    return this.tic(fn, at);
  },

  timeout: function(fn, at) {
    return this.tic(fn, at);
  }
}

module.exports = Time;