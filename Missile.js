const Movable = require('./Movable');

module.exports = class Missile extends Movable {

	constructor(options) {
		super(Object.assign({ power: 10, speed: 8 }, options));
	}

	get data() {
		return {
			x: this.x,
			y: this.y,
			speed: this.speed,
			angle: this.angle
		};
	}

	update() {
		this.computePosition();
	}

}
