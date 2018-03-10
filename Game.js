const User = require('./User');
const Utils = require('./Utils');

const GAME_DURATION = 2 * 60 * 1000;
// const GAME_DURATION = 20 * 1000;
const UPDATE_INTERVAL = 15;
const BROADCAST_INTERVAL = 45;

module.exports = class Game {

	constructor(options) {
		Object.assign(this, {
			status: 'created',
			users: [],
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
	}

	start() {
		this.startedAt = Date.now();
		this.status = 'running';
		this.updateLoop = setInterval(() => this.update(), UPDATE_INTERVAL);
		this.users.forEach(user => user.send('game_setup', this.map));
		this.broadcastLoop = setInterval(() => this.broadcast(), BROADCAST_INTERVAL);
	}

	stop() {
		this.status = 'finished';
		clearInterval(this.updateLoop);
		clearInterval(this.broadcastLoop);
		this.broadcast();
		setTimeout(() => {
			this.reset();
			this.start();
		}, 5000);
	}

	update() {
		if (this.time <= BROADCAST_INTERVAL) return this.stop();
		this.users.forEach(user => user.update());
		this.missiles.forEach(missile => missile.update());
		this.missiles.forEach(missile => {
			const collisionUser = this.users.find(user => user.contains(missile));
			if (collisionUser) {
				collisionUser.life -= missile.power;
				missile.user.missilesHit += 1;
				if (collisionUser.life <= 0) {
					collisionUser.deaths += 1;
					missile.user.kills += 1;
				}
				missile.destroy();
			}
		});
	}

	broadcast() {
		this.users.forEach(user => user.send('game_update', {
			time: this.status === 'finished' ? Utils.formatDuration(0) : Utils.formatDuration(this.time),
			status: this.status,
			users: this.users.map(x => Object.assign({ isMe: user === x }, x.data)),
			missiles: this.missiles.map(missile => missile.data)
		}));
	}

}
