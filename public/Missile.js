class Missile {

  constructor(options) {
    Object.assign(this, options);
  }

  update() {
    this.x = this.speed * Math.cos(this.angle) + this.x;
    this.y = this.speed * Math.sin(this.angle) + this.y;
  }

  render(context) {
    context.save();
    context.strokeStyle = "#FFFFFF";
    context.lineWidth = 2;
    context.translate(this.x, this.y);
    context.rotate(this.angle);

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(-10, 0);
    context.closePath();

    context.stroke();
    context.restore();
  }
}
