var brock = require('../index.js');
var game = brock();
var THREE = require('three');

var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var geometry = new THREE.BoxGeometry(2, 2, 2);
var material = new THREE.MeshBasicMaterial({
  color: 0x000000
});
var object = new THREE.Mesh(geometry, material);

scene.add(object);

var render = function() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
};
render();

game.component('rotateCamera', require('./components/rotatecamera'));
game.system('input', require('./systems/input'));

game.attachComponent(camera, 'rotateCamera');