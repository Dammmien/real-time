class App {

	constructor() {
		this.container = document.body;
		this.mount();
	}

	mount() {
		this.canvas = new Canvas(this.container);
		this.leaderboard = new Leaderboard(this.container);
		this.header = new Header(this.container);
	}
}
