var BoxManager = function() {
  this.boxables = {};
};

BoxManager.prototype = {
  constructor: BoxManager,

  addBoxable: function(boxable) {
    this.boxables[boxable.id] = boxable;
  },

  removeBoxable: function(boxable) {
    delete this.boxables[boxable.id];
  },

  getInBox: function(box) {
    var list = [];
    for (var id in this.boxables) {
      var boxable = this.boxables[id];
      if (boxable.x > box.origin.x &&
        boxable.y > box.origin.y &&
        boxable.x < box.origin.x + box.bounds.x &&
        boxable.y < box.origin.y + box.bounds.y) {
        list.push(boxable);
      }
    }

    return list;
  }
};

module.exports = BoxManager;