class Header {

	constructor(container) {
		this.container = container;
		this.mount();
	}

	updateTimer(x) {
		this.timer.innerHTML = x;
	}

	mount() {
		this.timer = document.createElement('div');
		this.timer.id = 'timer';
		this.container.appendChild(this.timer);
	}

}
