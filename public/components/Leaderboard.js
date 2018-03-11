class Leaderboard {

	constructor(container) {
		this.container = container;
	}

	getListItem(user) {
		const li = document.createElement('li');
		li.innerHTML = `${user.displayName}: ${user.score}`;
		if (user.isMe) li.className = 'me';
		return li;
	}

	updateList(users) {
		this.container.innerHTML = '';
		users.sort((a, b) => b.score - a.score).forEach(user => {
			this.container.appendChild(this.getListItem(user));
		});
	}

}
