const MissilesManager = require('./MissilesManager');

module.exports = class DoubleShooter {

	constructor(user) {
		this.user = user;
		this.missilesManager = new MissilesManager();
	}

	shoot() {
		const rightAngle = this.user.angle + (Math.random() - 0.5) / 20;
		const leftAngle = this.user.angle + (Math.random() - 0.5) / 20;

		this.rightShoot(rightAngle);
		this.leftShoot(leftAngle);
	}

	rightShoot(angle) {
		this.missilesManager.create({
			x: 10 * Math.cos(angle + Math.PI / 2) + this.user.x,
			y: 10 * Math.sin(angle + Math.PI / 2) + this.user.y,
			user: this.user,
			angle
		});
	}

	leftShoot(angle) {
		this.missilesManager.create({
			x: 10 * Math.cos(angle - Math.PI / 2) + this.user.x,
			y: 10 * Math.sin(angle - Math.PI / 2) + this.user.y,
			user: this.user,
			angle
		});
	}

}
