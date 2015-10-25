var getRoot = function(object) {
  return !object.parent ? object : getRoot(object.parent);
};

module.exports = getRoot;