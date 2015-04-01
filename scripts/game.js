window.Game = (function() {
	'use strict';

	/**
	 * Main game class.
	 * @param {Element} el jQuery element containing the game.
	 * @constructor
	 */
	var Game = function(el) {
		this.el = el;
		this.fitScreen();
		this.player = new window.Player(this.el.find('.Player'), this);
		this.pipes1 = new window.Pipes(this.el.find('#Pipe1-upper'),
				this.el.find('#Pipe1-lower'), this, 168);
		this.pipes2 = new window.Pipes(this.el.find('#Pipe2-upper'),
				this.el.find('#Pipe2-lower'), this, 105);
		this.isPlaying = false;

		this.ground = this.el.find('.ground');

		// Cache a bound onFrame since we need it each frame.
		this.onFrame = this.onFrame.bind(this);
		this.muteButton = this.el.find('#mute-button');
		this.muteButton.on('click', this.muteMusic.bind(this));
		// this.muteButton.addClass('mute');
	};

	/**
	 * Runs every frame. Calculates a delta and allows each game
	 * entity to update itself.
	 */
	Game.prototype.onFrame = function() {
		// Check if the game loop should stop.
		if (!this.isPlaying) {
			return;
		}

		// Calculate how long since last frame in seconds.
		var now = +new Date() / 1000,
				delta = now - this.lastFrame;
		this.lastFrame = now;

		// Update game entities.
		this.player.onFrame(delta);
		this.pipes1.onFrame(delta);
		this.pipes2.onFrame(delta);

		// Request next frame.
		window.requestAnimationFrame(this.onFrame);
	};

	Game.prototype.muteMusic = function() {
		var music = document.getElementById('music');
		
		if (music.muted) {
			//this.muteButton.removeClass('unmute').addClass('mute');
			this.muteButton.text('Mute');
		} else {
			//this.muteButton.removeClass('mute').addClass('unmute');
			this.muteButton.text('Unmute');
		}

		music.muted = !music.muted;
	};

	Game.prototype.fitScreen = function () {
		var fontSize = Math.min( 10, Math.min(
			window.innerWidth / 102.4,
			window.innerHeight / 50.6
		));
		this.el.css('font-size', fontSize + 'px');
	};

	/**
	 * Starts a new game.
	 */
	Game.prototype.start = function() {
		this.reset();

		// Restart the onFrame loop
		this.lastFrame = +new Date() / 1000;
		window.requestAnimationFrame(this.onFrame);
		this.isPlaying = true;
	};

	/**
	 * Resets the state of the game so a new game can be started.
	 */
	Game.prototype.reset = function() {
		this.player.reset();
		this.pipes1.reset();
		this.pipes2.reset();
		this.points = 0;
		$('.Score').text(this.points);
		this.ground.addClass('sliding');
	};

	/**
	 * Signals that the game is over.
	 */
	Game.prototype.gameover = function() {
		this.isPlaying = false;

		this.ground.removeClass('sliding');

		// Should be refactored into a Scoreboard class.
		var that = this;
		var scoreboardEl = this.el.find('.Scoreboard');

		scoreboardEl
			.addClass('is-visible')
			.find('.Scoreboard-score-number')
			.text(this.points);

		scoreboardEl
			.find('.Scoreboard-restart')
				.one('click', function() {
					scoreboardEl.removeClass('is-visible');
					that.start();
				});
	};

	Game.prototype.addPoint = function () {
		this.points++;
		$('.Score').text(this.points);
	};

	/**
	 * Some shared constants.
	 */
	Game.prototype.WORLD_WIDTH = 102.4;
	Game.prototype.WORLD_HEIGHT = 57.6;
	Game.prototype.DISTANCE_TO_GROUND = 44.3;

	return Game;
})();


