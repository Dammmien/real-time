class User {

  constructor(options) {
    Object.assign(this, options);
  }

  get displayName() {
    return this.name ? this.name : this.id;
  }

  update() {
    this.x = this.speed * Math.cos(this.angle) + this.x;
    this.y = this.speed * Math.sin(this.angle) + this.y;
    if (this.x > this.game.map.width || this.x < 0) this.angle = Math.PI - this.angle;
    if (this.y > this.game.map.height || this.y < 0) this.angle = Math.PI * 2 - this.angle;
  }

  render() {
    this.game.context.fillStyle = this.isMe ? '#FFFFFF' : '#C81E1E';
    this.game.context.lineWidth = 2;

    this.game.context.save();
    this.game.context.translate(this.x, this.y);
    this.game.context.rotate(this.angle);
    this.game.context.beginPath();
    this.game.context.moveTo(-8, -6);
    this.game.context.lineTo(8, 0);
    this.game.context.lineTo(-8, 6);
    this.game.context.lineTo(-6, 2);
    this.game.context.lineTo(-6, -2);
    this.game.context.closePath();
    this.game.context.fill();
    this.game.context.restore();

    this.game.context.fillStyle = 'rgb(120, 255, 210)';
    this.game.context.fillRect(this.x - 25, this.y + 20, this.life / 2, 1);
    this.game.context.fillStyle = 'rgba(255, 255, 255, 0.4)';
    this.game.context.fillRect(this.x - 25, this.y + 20, 50, 1);

    this.game.context.font = '8px "Press Start 2P"';
    this.game.context.fillStyle = 'rgba(120, 255, 210, 0.2)';
    this.game.context.textAlign = 'center';
    this.game.context.fillText(this.displayName.toUpperCase(), Math.floor(this.x), Math.floor(this.y) + 40);
  }
}
