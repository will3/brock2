var Game = require('../game');
var Component = require('../component');
var THREE = require('three');
var sinon = require('sinon');
var expect = require('chai').expect;

describe('Game', function() {
  it('should tick components', function() {
    var game = new Game();
    var object = new THREE.Object3D();
    game.register('test', {
      tick: function() {}
    });
    var component = game.attachComponent(object, 'test');
    var mock = sinon.mock(component);
    mock.expects('tick');

    game.tick(object);

    mock.verify();
  });

  it('should register component with function', function() {
    var game = new Game();
    var tickFunc = function() {};
    game.register('test', function() {
      this.key = 'value';
      this.tick = tickFunc;
    });
    var object = new THREE.Object3D();
    var component = game.attachComponent(object, 'test');
    expect(component.key).to.equal('value');
    expect(component.type).to.equal('test');
    expect(component.tick).to.equal(tickFunc);
    expect(component.object).to.equal(object);
  });

  it('should register component with object', function() {
    var game = new Game();
    var tickFunc = function() {};
    var test = {
      key: 'value',
      tick: tickFunc
    };
    game.register('test', test);
    var object = new THREE.Object3D();
    var component = game.attachComponent(object, 'test');
    expect(component.key).to.equal('value');
    expect(component.type).to.equal('test');
    expect(component.tick).to.equal(tickFunc);
    expect(component.object).to.equal(object);
  });

  describe('#getComponent', function() {
    it('should return component attached to same object', function() {
      var game = new Game();
      var object = new THREE.Object3D();
      game.register('type1', {});
      var component1 = game.attachComponent(object, 'type1');
      game.register('type2', {});
      var component2 = game.attachComponent(object, 'type2');

      expect(component1.getComponent('type2')).to.equal(component2);
    });
  });

  describe('#dettachComponent', function() {
    it('should destroy component', function() {
      var game = new Game();
      var object = new THREE.Object3D();
      game.register('test', {});
      var component = game.attachComponent(object, 'test');
      var mock = sinon.mock(component);
      mock.expects('destroy');

      game.dettachComponent(component);

      mock.verify();
    });
  });
});