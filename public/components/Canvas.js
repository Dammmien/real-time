class Canvas {

  constructor(container) {
    this.container = container;
    this.context = this.container.getContext('2d');
    this.size = {};
  }

  setSize(size) {
    this.size = size;
    this.container.height = size.height;
    this.container.style.height = size.height;
    this.container.width = size.width;
    this.container.style.width = size.width;
  }

  show() {
    this.container.style.display = 'block';
  }

  hide() {
    this.container.style.display = 'none';
  }

  clear() {
    this.context.clearRect(0, 0, this.size.width, this.size.height);
  }

  followUser(user) {
    this.container.style.left = `${-user.x + window.innerWidth / 2}px`;
    this.container.style.top = `${-user.y + window.innerHeight / 2}px`;
  }

}
