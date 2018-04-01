const Utils = require('./Utils');

module.exports = class Bonus {

	constructor(options) {
		Object.assign(this, {radius: 20}, options);
	}

	get data() {
		return {
			x: this.x,
			y: this.y,
			type: this.type
		};
	}

	apply(user) {
		if (this.type === 'SHIELD') {
			user.shield = 100;
		} else if (this.type === 'DOUBLE_SHOT') {
			user.setShooter('DOUBLE');
		} else if (this.type === 'LIFE') {
			user.life = 100;
		}
	}

	contains(p) {
		return Utils.getDistance(p, this) < this.radius;
	}

}
