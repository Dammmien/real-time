const MissilesManager = require('./MissilesManager');

module.exports = class SimpleShooter {

	constructor(user) {
		this.user = user;
		this.missilesManager = new MissilesManager();
	}

	shoot() {
		const angle = this.user.angle + (Math.random() - 0.5) / 10;

		this.missilesManager.create({
			x: 14 * Math.cos(angle) + this.user.x,
			y: 14 * Math.sin(angle) + this.user.y,
			user: this.user,
			angle
		});
	}

}
