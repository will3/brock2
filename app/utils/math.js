module.exports = {
  clamp: function(value, min, max) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
  },

  normalizeAngle: function(angle) {
    angle %= Math.PI * 2;
    if (angle < Math.PI) {
      angle += Math.PI * 2;
    }
    if (angle > Math.PI) {
      angle -= Math.PI * 2;
    }
    return angle;
  }
};