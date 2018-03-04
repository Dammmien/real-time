class User {

	constructor(options) {
		Object.assign(this, options);
	}

	update() {
		this.x = this.speed * Math.cos(this.angle) + this.x;
		this.y = this.speed * Math.sin(this.angle) + this.y;
	}

	render() {
    this.game.context.strokeStyle = '#FFFFFF';
    this.game.context.lineWidth = 2;

    this.game.context.save();
    this.game.context.translate(this.x, this.y);
    this.game.context.rotate(this.angle);
    this.game.context.beginPath();
    this.game.context.moveTo(-4, -4);
    this.game.context.lineTo(4, 0);
    this.game.context.lineTo(-4, 4);
    this.game.context.lineTo(-3, 1);
    this.game.context.lineTo(-3, -1);
    this.game.context.closePath();
    this.game.context.stroke();
    this.game.context.restore();


    this.game.context.fillStyle = '#FFFFFF';
		this.game.context.fillRect(this.x - 10, this.y + 12, this.life / 5, 1);
    this.game.context.fillStyle = 'rgba(255, 255, 255, 0.25)';
		this.game.context.fillRect(this.x - 10, this.y + 12, 20, 1);

		this.game.context.font = '7px Arial';
		this.game.context.fillStyle = 'rgba(255, 255, 255, 0.4)';
		this.game.context.textAlign = 'center';
		this.game.context.fillText(this.id.toUpperCase(), this.x, this.y + 26);
	}
}
