class Header {

	constructor(container) {
		this.container = container;
		this.mount();
	}

	updateTimer(value) {
		this.timer.textContent = value;
	}

	mount() {
		this.timer = document.createElement('div');
		this.timer.id = 'timer';
		this.container.appendChild(this.timer);
	}

}
