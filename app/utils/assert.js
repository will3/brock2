module.exports = function(value) {
  if (value !== true) {
    throw new Error('expected true,but got: ' + value);
  }
};

module.exports.exists = function(object, name) {
  if (object === null || object === undefined) {
    throw new Error('expected ' + name + ' to exist, but got: ' + object);
  }
};