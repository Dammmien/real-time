class Leaderboard {

	constructor(container) {
		this.container = container;
		this.data = {
			users: store.subscribe('users', this),
			total: null
		};
		this.mount();
	}

	getListItem(user) {
		const li = document.createElement('li');
		li.innerHTML = `${user.displayName}: ${user.score}`;
		if (user.isMe) li.className = 'me';
		return li;
	}

	update(key, value) {
		this.data[key] = value;
		const total = this.data.users.reduce((total, user) => total + user.score, 0);
		if (total !== this.data.total) {
			this.render();
			this.data.total = total;
		}
	}

	render() {
		this.element.innerHTML = '';
		this.data.users.sort((a, b) => b.score - a.score).forEach(user => {
			this.element.appendChild(this.getListItem(user));
		});
	}

	mount(){
		this.element = document.createElement('ul');
		this.element.id = 'leaderboard';
		this.container.appendChild(this.element);
	}

}
