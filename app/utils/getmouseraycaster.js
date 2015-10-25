var THREE = require('three');

module.exports = function(camera, mouse) {
  var vector = new THREE.Vector2();
  vector.x = (mouse.mouseX / window.innerWidth) * 2 - 1;
  vector.y = -(mouse.mouseY / window.innerHeight) * 2 + 1;

  var raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(vector, camera);

  return raycaster;
};