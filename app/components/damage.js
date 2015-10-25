var Damage = function() {
  //shouldn't damage owner
  this.ownerId = null;
};

Damage.prototype = {
  constructor: Damage
};

module.exports = Damage;