const UsersManager = require('./UsersManager');
const MissilesManager = require('./MissilesManager');
const BonusManager = require('./BonusManager');
const Utils = require('./Utils');

const GAME_DURATION = 2 * 60 * 1000;
const BONUS_INTERVAL = 30 * 1000;
const UPDATE_INTERVAL = 15;
const BROADCAST_INTERVAL = 45;

module.exports = class Game {

	constructor(options) {
		Object.assign(this, {
			status: 'created',
			bonus: []
		}, options);

		this.usersManager = new UsersManager(this.map);
		this.missilesManager = new MissilesManager(this.map);
		this.bonusManager = new BonusManager();
	}

	get time() {
		return GAME_DURATION - ( Date.now() - this.startedAt );
	}

	reset() {
		this.usersManager.reset();
		this.missilesManager.reset();
		this.bonusManager.reset();
	}

	start() {
		this.startedAt = Date.now();
		this.status = 'running';
		this.updateLoop = setInterval(() => this.update(), UPDATE_INTERVAL);
		this.usersManager.users.forEach(user => user.send('game_setup', this.map));
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
		this.missilesManager.missiles.forEach(missile => {
			const collisionUser = this.usersManager.users.find(user => user !== missile.user && user.contains(missile));
			if (collisionUser) {
				collisionUser.applyDamage(missile.power);
				missile.user.missilesHit += 1;
				if (collisionUser.life <= 0) {
					collisionUser.deaths += 1;
					missile.user.kills += 1;
				}
				this.missilesManager.destroy(missile);
			}
		});

		this.bonusManager.bonus.forEach(bonus => {
			const collisionUser = this.usersManager.users.find(user => bonus.contains(user));

			if (collisionUser) {
				if (bonus.type === 'SHIELD') {
					collisionUser.shield = 100;
				} else if (bonus.type === 'DOUBLE_SHOT') {
					collisionUser.setShooter('DOUBLE');
				}

				this.bonusManager.destroy(bonus);
			}
		});
	}

	createBonus() {
		const types = ['DOUBLE_SHOT', 'SHIELD'];
		const type = types[Math.floor(Math.random() * types.length)];

		this.bonusManager.create({
			type,
			game: this,
			x: Math.random() * this.map.width,
			y: Math.random() * this.map.height
		});
	}

	createPlayer(name, socket) {
		const user = this.usersManager.create({
			id: Math.random().toString(36).substring(2, 12),
			x: Math.random() * this.map.width,
			y: Math.random() * this.map.height,
			map: this.map,
			name,
			socket
		});

		socket.onclose = () => this.usersManager.destroy(user);

		return user;
	}

	update() {
		if (this.time <= BROADCAST_INTERVAL) return this.stop();
		this.usersManager.users.forEach(user => user.update());
		this.missilesManager.update();
		this.checkCollision();
	}

	broadcast() {
		this.usersManager.users.forEach(user => user.send('game_update', {
			time: this.status === 'finished' ? Utils.formatDuration(0) : Utils.formatDuration(this.time),
			status: this.status,
			users: this.usersManager.users.map(x => Object.assign({ isMe: user === x }, x.data)),
			missiles: this.missilesManager.missiles.map(missile => missile.data),
			bonus: this.bonusManager.bonus.map(bonus => bonus.data)
		}));
	}

}
