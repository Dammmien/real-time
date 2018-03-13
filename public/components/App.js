class App {

	constructor(map) {
		this.container = document.body;
		this.state = store.getState();
		store.subscribe(state => this.state = store.getState());
		this.startUpdateLoop();
		this.mount();
	}

	setup(map){
		this.canvas.setSize(map);
		this.canvas.show();
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
