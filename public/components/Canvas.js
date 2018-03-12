class Canvas {

  constructor(container) {
    this.container = container;
    this.size = {};
    this.mount()
  }

  setSize(size) {
    this.size = size;
    this.element.height = size.height;
    this.element.style.height = size.height;
    this.element.width = size.width;
    this.element.style.width = size.width;
  }

  show() {
    this.element.style.display = 'block';
  }

  hide() {
    this.element.style.display = 'none';
  }

  clear() {
    this.context.clearRect(0, 0, this.size.width, this.size.height);
  }

  followUser(user) {
    this.element.style.left = `${-user.x + window.innerWidth / 2}px`;
    this.element.style.top = `${-user.y + window.innerHeight / 2}px`;
  }

  mount() {
    this.element = document.createElement('canvas');
    this.context = this.element.getContext('2d');
    this.container.appendChild(this.element);
  }

}
