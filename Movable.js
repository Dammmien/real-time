module.exports = class Movable {

	constructor(options) {
		Object.assign(this, { x: 100, y: 100, angle: 0, speed: 0}, options);
	}

	computePosition() {
		this.x = this.speed * Math.cos(this.angle) + this.x;
		this.y = this.speed * Math.sin(this.angle) + this.y;
	}

}
