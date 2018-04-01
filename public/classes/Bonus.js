class Bonus {

  constructor(options) {
    Object.assign(this, options);

    if (this.type !== 'DOUBLE_SHOT') {
      this.img = new Image();
      this.img.src = this.getImgSrc();
    }
  }

  getImgSrc(type) {
    return {
      SHIELD: './shield.png',
      LIFE: './heart.png'
    }[this.type];
  }

  render(context) {
    context.fillStyle = `rgba(120, 255, 210, 0.1)`;
    context.strokeStyle = `rgb(120, 255, 210)`;
    context.lineWidth = 2;
    context.beginPath();
    context.arc(this.x, this.y, 18, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
    context.stroke();

    if (this.type === 'DOUBLE_SHOT') {
      context.font = '8px "Press Start 2P"';
      context.fillStyle = 'rgb(120, 255, 210)';
      context.fillText('X2', Math.floor(this.x + 2), Math.floor(this.y) + 5);
    } else if (this.type === 'LIFE') {
      context.drawImage(this.img, this.x - 8, this.y - 8, 16, 16);
    } else if (this.type === 'SHIELD') {
      context.drawImage(this.img, this.x - 10, this.y - 10, 20, 20);
    }
  }
}
