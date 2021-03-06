const Movable = require('./Movable');
const SimpleShooter = require('./SimpleShooter');
const DoubleShooter = require('./DoubleShooter');
const Utils = require('./Utils');
const WebSocket = require('ws');

module.exports = class User extends Movable {

	constructor(options) {
		super(Object.assign({
			lastShoot: 0,
			controller: {},
			life: 100,
			kills: 0,
			deaths: 0,
			shield: 0,
			missilesHit: 0
		}, options));

		this.setShooter('SIMPLE');

		this.initListener();
	}

	get score() {
		return Math.floor((this.kills / (this.deaths + 1) * 1000) + this.missilesHit * 100);
	}

	get data() {
		return {
			id: this.id,
			name: this.name,
			score: this.score,
			shield: this.shield,
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
		this.socket.onmessage = event => this.controller = JSON.parse(event.data);
		this.socket.onerror = event => console.log(event);
	}

	setShooter(type)  {
		if (type === 'SIMPLE') this.shooter = new SimpleShooter(this);
		if (type === 'DOUBLE') this.shooter = new DoubleShooter(this);
	}

	shoot() {
		this.shooter.shoot();
		this.lastShoot = 10;
	}

	send(name, data) {
		if (this.socket.readyState === WebSocket.OPEN) {
			this.socket.send(JSON.stringify({ name, data }));
		} else {
			console.log('socket closed');
		}
	}

	respawn() {
		this.life = 100;
		this.x = this.map.width / 2;
		this.y = this.map.height / 2;
	}

	applyController() {
		if (this.controller.left) this.angle -= (6 - this.speed) / 100;
		if (this.controller.right) this.angle += (6 - this.speed) / 100;
		if (this.controller.top && this.speed + 0.2 < 5) this.speed += 0.2;
		if (this.controller.shoot && this.lastShoot === 0) this.shoot();
	}

	applyDamage(damage) {
		if (this.shield > 0) this.shield = Math.max(0, this.shield - damage);
		else this.life -= damage;
	}

	contains(p) {
		return Utils.getDistance(p, this) < (this.shield ? 20 : 10);
	}

	computePosition() {
		this.x = this.speed * Math.cos(this.angle) + this.x;
		this.y = this.speed * Math.sin(this.angle) + this.y;
		if (this.x > this.map.width || this.x < 0) this.angle = Math.PI - this.angle;
		if (this.y > this.map.height || this.y < 0) this.angle = Math.PI * 2 - this.angle;
	}

	update() {
		if (this.lastShoot > 0) this.lastShoot -= 1;
		this.applyController();
		if (this.speed - 0.05 > 0) this.speed -= 0.05;
		this.computePosition();
		if (this.life <= 0) this.respawn();
	}

}
