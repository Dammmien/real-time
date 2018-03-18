const User = require('./User');
const Bonus = require('./Bonus');
const Utils = require('./Utils');

const GAME_DURATION = 2 * 60 * 1000;
const BONUS_INTERVAL = 30 * 1000;
const UPDATE_INTERVAL = 15;
const BROADCAST_INTERVAL = 45;

module.exports = class Game {

	constructor(options) {
		Object.assign(this, {
			status: 'created',
			users: [],
			bonus: [],
			missiles: []
		}, options);
	}

	get time() {
		return GAME_DURATION - ( Date.now() - this.startedAt );
	}

	reset() {
		this.users = this.users.map(user => {
			return new User({
				id: user.id,
				x: Math.random() * this.map.width,
				y: Math.random() * this.map.height,
				name: user.name,
				socket: user.socket,
				game: this
			});
		});

		this.missiles = [];
		this.bonus = [];
	}

	start() {
		this.startedAt = Date.now();
		this.status = 'running';
		this.updateLoop = setInterval(() => this.update(), UPDATE_INTERVAL);
		this.users.forEach(user => user.send('game_setup', this.map));
		this.broadcastLoop = setInterval(() => this.broadcast(), BROADCAST_INTERVAL);
		this.bonusLoop = setInterval(() => this.createBonus(), BONUS_INTERVAL);
	}

	stop() {
		this.status = 'finished';
		clearInterval(this.updateLoop);
		clearInterval(this.broadcastLoop);
		clearInterval(this.bonusLoop);
		this.broadcast();
		setTimeout(() => {
			this.reset();
			this.start();
		}, 5000);
	}

	checkCollision() {
		this.missiles.forEach(missile => {
			const collisionUser = this.users.find(user => user !== missile.user && user.contains(missile));
			if (collisionUser) {
				collisionUser.applyDamage(missile.power);
				missile.user.missilesHit += 1;
				if (collisionUser.life <= 0) {
					collisionUser.deaths += 1;
					missile.user.kills += 1;
				}
				missile.destroy();
			}
		});

		this.bonus.forEach(bonus => {
			const collisionUser = this.users.find(user => bonus.contains(user));

			if (collisionUser) {
				collisionUser.shield = 100;
				bonus.destroy();
			}
		});
	}

	createBonus() {
		this.bonus.push(
			new Bonus({
				type: 'shield',
				game: this,
				x: Math.random() * this.map.width,
				y: Math.random() * this.map.height
			})
		);
	}

	update() {
		if (this.time <= BROADCAST_INTERVAL) return this.stop();
		this.users.forEach(user => user.update());
		this.missiles.forEach(missile => missile.update());
		this.checkCollision();
	}

	broadcast() {
		this.users.forEach(user => user.send('game_update', {
			time: this.status === 'finished' ? Utils.formatDuration(0) : Utils.formatDuration(this.time),
			status: this.status,
			users: this.users.map(x => Object.assign({ isMe: user === x }, x.data)),
			missiles: this.missiles.map(missile => missile.data),
			bonus: this.bonus.map(bonus => bonus.data)
		}));
	}

}
