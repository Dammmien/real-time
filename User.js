const Movable = require('./Movable');
const Missile = require('./Missile');

module.exports = class User extends Movable {

	constructor(options) {
		super(Object.assign({ lastShoot: 0, controller: {}, life: 100, kills: 0, death: 0 }, options));
		this.initListener();
	}

	get data() {
		return {
			id: this.id,
			x: this.x,
			y: this.y,
			life: this.life,
			speed: this.speed,
			angle: this.angle
		};
	}

	initListener() {
		this.socket.on('message', message => this.controller = JSON.parse(message));
		this.socket.on('close', () => this.destroy());
		this.socket.on('error', err => console.log(err));
	}

	shoot() {
		this.game.missiles.push(new Missile({
			x: 14 * Math.cos(this.angle) + this.x,
		  y: 14 * Math.sin(this.angle) + this.y,
			game: this.game,
			angle: this.angle,
			speed: 8
		}));

		this.lastShoot = 10;
	}

	send(name, data) {
		this.socket.send(JSON.stringify({name, data}));
	}

	respawn() {
		this.death += 1;
		this.life = 100;
		this.x = this.game.map.width / 2;
		this.y = this.game.map.height / 2;
	}

	destroy() {
		this.game.users.splice(this.game.users.indexOf(this), 1);
	}

	applyController() {
		if (this.lastShoot > 0) this.lastShoot -= 1;

		if (this.controller.left) this.angle -= ( 5 - this.speed ) / 100;
		if (this.controller.right) this.angle += ( 5 - this.speed ) / 100;

		if (this.controller.top) {
			if (this.speed + 0.1 < 4) this.speed += 0.1;
		} else {
			if (this.speed - 0.05 > 0) this.speed -= 0.05;
		}

		if (this.controller.shoot && this.lastShoot === 0) this.shoot();
	}

	contains(p) {
		return p.x >= this.x - 4 && p.x <= this.x + 4 && p.y >= this.y - 4 && p.y <= this.y + 4;
	}

	update() {
		this.applyController();
		this.computePosition();
		if (this.life <= 0) this.respawn();
	}

}
