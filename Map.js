module.exports = class GameMap {

	constructor(options) {
		Object.assign(this, options);
	}

	isOut(element) {
		return element.x < 0 || element.x > this.width || element.y < 0 || element.y > this.height;
	}

}
