const Movable = require('./Movable');
const Missile = require('./Missile');

module.exports = class User extends Movable {

	constructor(options) {
		super(Object.assign({ lastShoot: 0, controller: {} }, options));
		this.initListener();
	}

	get data() {
		return {
			x: this.x,
			y: this.y,
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
			x: this.x,
			y: this.y,
			game: this.game,
			angle: this.angle,
			speed: 10
		}));

		this.lastShoot = 10;
	}

	send(name, data) {
		this.socket.send(JSON.stringify({name, data}));
	}

	destroy() {
		this.game.users.splice(this.game.users.indexOf(this), 1);
	}

	applyController() {
		if (this.lastShoot > 0) this.lastShoot -= 1;

		if (this.controller.left) this.angle -= 0.05;
		if (this.controller.right) this.angle += 0.05;

		if (this.controller.top) {
			if (this.speed < 4) this.speed += 0.1;
		} else {
			if (this.speed > 0) this.speed -= 0.05;
		}

		if (this.controller.shoot && this.lastShoot === 0) this.shoot();
	}

	update() {
		this.applyController();
		this.computePosition();
	}

}
