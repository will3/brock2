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

// var object = new THREE.Mesh();
// scene.add(object);

var render = function() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
};
render();

game.component('rotateCamera', require('./components/rotatecamera'));
game.component('blockModel', require('./components/blockmodel'));
game.component('shipGenerator', require('./components/shipgenerator'));
game.component('ship', require('./components/ship'));
game.component('shipAI', require('./components/shipai'));
game.component('laser', require('./components/laser'));
game.component('turrent', require('./components/turrent'));
game.component('selfDestruct', require('./components/selfdestruct'));
game.component('damagable', require('./components/damagable'));
game.component('damage', require('./components/damage'));

game.attachComponent(camera, 'rotateCamera');
var shipGenerator = game.attachComponent(scene, 'shipGenerator');
shipGenerator.num = 5;

var object = new THREE.Object3D();
scene.add(object);