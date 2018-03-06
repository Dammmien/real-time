const Movable = require('./Movable');

module.exports = class Missile extends Movable {

	constructor(options) {
		super(Object.assign({ power: 10 }, options));
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
		if (this.isOutOfTheMap) {
			this.destroy();
		} else {
			this.computePosition();
		}
	}

	destroy() {
		this.game.missiles.splice(this.game.missiles.indexOf(this), 1);
	}

}
