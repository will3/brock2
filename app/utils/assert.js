module.exports = {
  exists: function(object, name) {
    if (object === null || object === undefined) {
      throw new Error('expected ' + name + ' to exist, but got: ' + object);
    }
  }
};