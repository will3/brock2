var brock = require('../index.js');
var game = brock();
var THREE = require('three');
// THREE.ImageUtils.crossOrigin = 'localhost';

var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

var renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var render = function() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  game.onRender();
};
render();

game.component('rotateCamera', require('./components/rotatecamera'));
game.component('blockModel', require('./components/blockmodel'));
game.component('fleet', require('./components/fleet'));
game.component('ship', require('./components/ship'));
game.component('pilot', require('./components/pilot'));
game.component('laser', require('./components/laser'));
game.component('turrent', require('./components/turrent'));
game.component('selfDestruct', require('./components/selfdestruct'));
game.component('damagable', require('./components/damagable'));
game.component('damage', require('./components/damage'));
game.component('pauseGame', require('./components/pausegame'));
game.component('guiText', require('./components/guitext'));
game.component('guiBox', require('./components/guibox'));
game.component('waypoint', require('./components/waypoint'));
game.component('waypath', require('./components/waypath'));
game.component('commander', require('./components/commander'));
game.component('yIndicator', require('./components/yindicator'));
game.component('boxable', require('./components/boxable'));

game.system('uiState', require('./systems/uistate'));

game.value('cache', {
  materials: {},
  geometries: {},
  textures: {},
  mainCamera: camera,
  mainScene: scene,
  mainRenderer: renderer
});

game.attachComponent(camera, 'rotateCamera');
var fleet = game.attachComponent(scene, 'fleet');
fleet.target = new THREE.Vector3(0, 0, 0);

game.attachComponent(scene, 'pauseGame');
game.attachComponent(scene, 'commander');