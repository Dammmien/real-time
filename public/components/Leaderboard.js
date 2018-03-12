class Leaderboard {

	constructor(container) {
		this.container = container;
		store.subscribe(state => this.update(store.getState()));
		this.mount();
	}

	getListItem(user) {
		const li = document.createElement('li');
		li.innerHTML = `${user.displayName}: ${user.score}`;
		if (user.isMe) li.className = 'me';
		return li;
	}

	update(state) {
		this.element.innerHTML = '';
		state.users.sort((a, b) => b.score - a.score).forEach(user => {
			this.element.appendChild(this.getListItem(user));
		});
	}

	mount(){
		this.element = document.createElement('ul');
		this.element.id = 'leaderboard';
		this.container.appendChild(this.element);
	}

}
