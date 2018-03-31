class Header {

	constructor(container) {
		this.container = container;
		this.data = {
			timer: store.subscribe('timer', this)
		};
		this.mount();
	}

	update(key, value) {
		this.data[key] = value;
		this.render();
	}

	render() {
		this.timer.textContent = this.data.timer;
	}

	mount() {
		this.element = document.createElement('header');
		this.timer = document.createElement('div');
		this.timer.id = 'timer';
		this.container.appendChild(this.element);
		this.element.appendChild(this.timer);
	}

}
