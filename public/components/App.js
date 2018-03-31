class App {

	constructor(map) {
		this.container = document.body;
		this.data = {
			users: store.subscribe('users', this),
			missiles: store.subscribe('missiles', this)
		};
		this.startUpdateLoop();
		this.mount();
	}

	setup(map){
		this.canvas.setSize(map);
		this.canvas.show();
	}

	update(key, value) {
		this.data[key] = value;
	}

	startUpdateLoop() {
		setInterval(() => {
			this.data.users.forEach(user => user.update());
			this.data.missiles.forEach(missile => missile.update());
		}, 15);
	}

	mount() {
		this.canvas = new Canvas(this.container);
		this.leaderboard = new Leaderboard(this.container);
		this.header = new Header(this.container);
	}
}
