const Movable = require('./Movable');
const Missile = require('./Missile');
const WebSocket = require('ws');

module.exports = class User extends Movable {

	constructor(options) {
		super(Object.assign({ lastShoot: 0, controller: {}, life: 100, kills: 0, deaths: 0 }, options));
		this.initListener();
	}

	get data() {
		return {
			id: this.id,
			x: this.x,
			y: this.y,
			life: this.life,
			deaths: this.deaths,
			kills: this.kills,
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
		  user: this,
			game: this.game,
			angle: this.angle,
			speed: 8
		}));

		this.lastShoot = 10;
	}

	send(name, data) {
		if (this.socket.readyState === WebSocket.OPEN) {
			this.socket.send(JSON.stringify({name, data}));
		} else {
			console.log( 'socket closed' );
		}
	}

	respawn() {
		this.life = 100;
		this.x = this.game.map.width / 2;
		this.y = this.game.map.height / 2;
	}

	destroy() {
		this.game.users.splice(this.game.users.indexOf(this), 1);
	}

	applyController() {
		if (this.controller.left) this.angle -= ( 5 - this.speed ) / 100;
		if (this.controller.right) this.angle += ( 5 - this.speed ) / 100;
		if (this.controller.top && this.speed + 0.2 < 4) this.speed += 0.2;
		if (this.controller.shoot && this.lastShoot === 0) this.shoot();
	}

	contains(p) {
		return p.x >= this.x - 4 && p.x <= this.x + 4 && p.y >= this.y - 4 && p.y <= this.y + 4;
	}

	computePosition() {
		this.x = this.speed * Math.cos(this.angle) + this.x;
		this.y = this.speed * Math.sin(this.angle) + this.y;
		if (this.x > this.game.map.width || this.x < 0) this.angle = Math.PI - this.angle;
		if (this.y > this.game.map.height || this.y < 0) this.angle = Math.PI * 2 - this.angle;
	}

	update() {
		if (this.lastShoot > 0) this.lastShoot -= 1;
		this.applyController();
		if (this.speed - 0.05 > 0) this.speed -= 0.05;
		this.computePosition();
		if (this.life <= 0) this.respawn();
	}

}
