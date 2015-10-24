module.exports = function() {
  return typeof window === 'undefined' ? undefined : window;
};