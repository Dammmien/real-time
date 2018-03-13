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

	contains(p) {
		return Utils.getDistance(p, this) < this.radius;
	}

	destroy() {
		this.game.bonus.splice(this.game.bonus.indexOf(this), 1);
	}

}
