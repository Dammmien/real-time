class Leaderboard {

	constructor(container) {
		this.container = container;
		this.state = store.getState();
		store.subscribe(() => {
			const state = store.getState();
			if (state.users !== this.state.users) {
				this.state = state;
				this.update();
			}
		});
		this.mount();
	}

	getListItem(user) {
		const li = document.createElement('li');
		li.innerHTML = `${user.displayName}: ${user.score}`;
		if (user.isMe) li.className = 'me';
		return li;
	}

	update() {
		this.element.innerHTML = '';
		this.state.users.sort((a, b) => b.score - a.score).forEach(user => {
			this.element.appendChild(this.getListItem(user));
		});
	}

	mount(){
		this.element = document.createElement('ul');
		this.element.id = 'leaderboard';
		this.container.appendChild(this.element);
	}

}
