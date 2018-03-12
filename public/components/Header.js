class Header {

	constructor(container) {
		this.container = container;
		store.subscribe(state => this.update(store.getState()));
		this.mount();
	}

	update(state) {
		this.timer.textContent = state.timer;
	}

	mount() {
		this.element = document.createElement('header');
		this.timer = document.createElement('div');
		this.timer.id = 'timer';
		this.container.appendChild(this.element);
		this.element.appendChild(this.timer);
	}

}
