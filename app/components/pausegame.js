var PauseGame = function($game, $keyboard) {
  this.game = $game;
  this.keyboard = $keyboard;
};

PauseGame.$inject = ['$game', '$keyboard'];

PauseGame.prototype = {
  constructor: PauseGame,

  tick: function() {
    if (this.keyboard.keyDown('space')) {
      this.game.timeScale = (this.game.timeScale === 0) ? 1 : 0;
    }
  }
};

module.exports = PauseGame;