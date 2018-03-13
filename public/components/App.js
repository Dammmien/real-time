class App {

	constructor(map) {
		this.container = document.body;
		this.map = map;
		this.state = store.getState();
		this.mount();
		this.canvas.setSize(this.map);
		this.canvas.show();
		store.subscribe(state => this.state = store.getState());
		this.startUpdateLoop();
	}

	startUpdateLoop() {
		setInterval(() => {
			this.state.users.forEach(user => user.update());
			this.state.missiles.forEach(missile => missile.update());
		}, 15);
	}

	mount() {
		this.canvas = new Canvas(this.container);
		this.leaderboard = new Leaderboard(this.container);
		this.header = new Header(this.container);
	}
}
