var Game = require('../game');
var Component = require('../component');
var THREE = require('three');
var sinon = require('sinon');
var expect = require('chai').expect;

describe('Game', function() {
  var game;
  beforeEach(function() {
    game = new Game();
    game.start();
  });

  it('should get window module', function() {
    game.component('test', ['$window', function($window) {
      console.log($window);
    }]);
    var object = new THREE.Object3D();
    game.attachComponent(object, 'test');
  });
});