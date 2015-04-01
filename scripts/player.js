window.Player = (function() {
	'use strict';

	var Controls = window.Controls;

	// All these constants are in em's, multiply by 10 pixels
	// for 1024x576px canvas.
	var SPEED = 30; // * 10 pixels per second
	// var WIDTH = 5;
	var HEIGHT = 4.9;
	var INITIAL_POSITION_X = 30;
	var INITIAL_POSITION_Y = 25;

	var Player = function(el, game) {
		this.el = el;
		this.game = game;
		this.pos = { x: 0, y: 0 };
		this.playing = false;
		this.deg = 0;
		this.isDead = false;
	};

	/**
	 * Resets the state of the player for a new game.
	 */
	Player.prototype.reset = function() {
		this.pos.x = INITIAL_POSITION_X;
		this.pos.y = INITIAL_POSITION_Y;
		this.playing = false;
		this.isDead = false;
		this.el.removeClass('flapping');
	};

	Player.prototype.onFrame = function(delta) {
		var degrees = 0;
		if(!this.isDead) {
			if (Controls.didJump()) {
				if (!this.playing) {
					this.playing = true;
				}
				this.pos.y -= delta * SPEED * 13;
				// animation up
				if (this.deg > -45) {
					this.deg = -45;
					degrees = this.deg;
				}
				this.flap();
			} else {
				if (this.playing) {
					this.pos.y += delta * SPEED * 0.7;
					// animation down
					if (this.deg < 90) {
						this.deg += 2;
						degrees = this.deg;
					} else {
						degrees = 90;
					}
				}
			}
		}

		this.checkCollisionWithBounds();

		// Update UI
		this.el.css('-webkit-transform', 'translate3d(' + this.pos.x + 'em, ' + this.pos.y + 'em, 0em)' +
										 'rotate3d(0, 0, 1, ' + degrees + 'deg)');
		
	};

	Player.prototype.flap = function () {
		this.el.addClass('flapping');
		var flapSound = document.getElementById('flap-sound');
		flapSound.play();
	};

	Player.prototype.checkCollisionWithBounds = function() {
		if (this.pos.y + HEIGHT > this.game.DISTANCE_TO_GROUND) {
			return this.game.gameover();
		}
	};

	return Player;

})();
