var SelfDestruct = function() {
  this.time = 10000;
  this._timer = 0;
};

SelfDestruct.prototype = {
  constructor: SelfDestruct,
  tick: function(dt) {
    this._timer += dt;

    if (this._timer > this.time) {
      this.removeObject();
    }
  }
};

module.exports = SelfDestruct;