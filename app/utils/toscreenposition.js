module.exports = function(point, renderer, camera) {
  // var toScreenPosition = function(obj, renderer, camera) {
  var vector = point.clone();

  var widthHalf = 0.5 * renderer.context.canvas.width;
  var heightHalf = 0.5 * renderer.context.canvas.height;

  // obj.updateMatrixWorld();
  // vector.setFromMatrixPosition(obj.matrixWorld);
  vector.project(camera);

  vector.x = (vector.x * widthHalf) + widthHalf;
  vector.y = -(vector.y * heightHalf) + heightHalf;

  return {
    x: vector.x,
    y: vector.y
  };
};