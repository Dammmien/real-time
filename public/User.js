class User {

	constructor(options) {
		Object.assign(this, options);
	}

	update() {
		this.x = this.speed * Math.cos(this.angle) + this.x;
		this.y = this.speed * Math.sin(this.angle) + this.y;
	}

	render() {
    this.game.context.beginPath();
    this.game.context.strokeStyle = '#FFFFFF';
    this.game.context.lineWidth = 1;
    this.game.context.save();
    this.game.context.translate(this.x, this.y);
    this.game.context.rotate(this.angle);
    this.game.context.moveTo(-5, 0);
    this.game.context.lineTo(5, 0);
    this.game.context.moveTo(-5, -5);
    this.game.context.lineTo(-5, 5);
    this.game.context.stroke();
    this.game.context.closePath();
    this.game.context.restore();
	}
}
