export default class Bonus {

  constructor(options) {
    Object.assign(this, options);
  }

  render(context) {
    context.fillStyle = `rgba(255, 255, 255, 0.1)`;
    context.beginPath();
    context.arc(this.x, this.y, 20, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
    context.font = '16px "Press Start 2P"';
    context.fillStyle = 'rgb(120, 255, 210)';
    context.fillText('?', Math.floor(this.x + 2), Math.floor(this.y) + 10);
  }
}
