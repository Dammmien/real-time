module.exports = class Movable {

	constructor(options) {
		Object.assign(this, { x: 100, y: 100, angle: 0, speed: 0}, options);
	}

	get isOutOfTheMap() {
		return this.x < 0 || this.x > this.game.map.width || this.y < 0 || this.y > this.game.map.height;
	}

	computePosition() {
		this.x = this.speed * Math.cos(this.angle) + this.x;
		this.y = this.speed * Math.sin(this.angle) + this.y;
	}

}
