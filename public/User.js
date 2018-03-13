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
    if (this.x > 4000 || this.x < 0) this.angle = Math.PI - this.angle;
    if (this.y > 3000 || this.y < 0) this.angle = Math.PI * 2 - this.angle;
  }

  renderLife(context) {
    context.fillStyle = 'rgb(120, 255, 210)';
    context.fillRect(this.x - 25, this.y + 20, this.life / 2, 1);
    context.fillStyle = 'rgba(255, 255, 255, 0.4)';
    context.fillRect(this.x - 25, this.y + 20, 50, 1);
  }

  renderName(context) {
    context.font = '8px "Press Start 2P"';
    context.fillStyle = 'rgba(120, 255, 210, 0.2)';
    context.textAlign = 'center';
    context.fillText(this.displayName.toUpperCase(), Math.floor(this.x), Math.floor(this.y) + 40);
  }

  render(context) {
    context.fillStyle = this.isMe ? '#FFFFFF' : '#C81E1E';
    context.lineWidth = 2;

    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    context.beginPath();
    context.moveTo(-8, -6);
    context.lineTo(8, 0);
    context.lineTo(-8, 6);
    context.lineTo(-6, 2);
    context.lineTo(-6, -2);
    context.closePath();
    context.fill();
    context.restore();

    this.renderLife(context);
    this.renderName(context);
  }
}
