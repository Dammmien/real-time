const name = prompt("Please enter your name", undefined);
const HOST = location.origin.replace('http', 'ws') + (name ? `?name=${name.substring(0, 10)}`: '');
const socket = new WebSocket(HOST);

const header = new Header(document.querySelector('header'));
const leaderboard = new Leaderboard(document.getElementById('leaderboard'));
const canvas = new Canvas(document.querySelector('canvas'));

let game = {
	context : canvas.context,
	users: [],
	missiles: []
};

socket.onopen = () => {
	console.log( 'open' );
};

socket.onmessage = (event) => {
	event = JSON.parse(event.data);

	if (event.name === 'game_setup') {
		game.map = {
			height: event.data.height,
			width: event.data.width
		};

		canvas.setSize(game.map);
		canvas.show();
	} else if (event.name === 'game_update') {
		game.users = event.data.users.map( user => new User(Object.assign(user, {game})) );
		game.missiles = event.data.missiles.map( missile => new Missile(Object.assign(missile, {game})) );
		game.status = event.data.status;

		header.updateTimer(event.data.time);
		leaderboard.updateList(game.users);
		if (event.data.status === 'finished') canvas.hide();
	}
};

window.addEventListener('beforeunload', () => {
	socket.close();
});

setInterval(() => {
  game.users.forEach( user => user.update() );
  game.missiles.forEach( missile => missile.update() );
}, 15);

const loop = () => {
  canvas.clear();
  game.users.forEach( user => {
  	user.render();
  	if (user.isMe) canvas.followUser(user);
  });
  game.missiles.forEach( missile => missile.render() );
  requestAnimationFrame(loop);
}

loop();

const controller = {
	left: false,
	top: false,
	right: false,
	bottom: false
};

document.addEventListener('keydown', event => {
	if (event.keyCode === 37 && !controller.left) controller.left = true;
	else if (event.keyCode === 38 && !controller.top) controller.top = true;
	else if (event.keyCode === 39 && !controller.right) controller.right = true;
	else if (event.keyCode === 40 && !controller.bottom) controller.bottom = true;
	else if (event.keyCode === 32 && !controller.shoot) controller.shoot = true;
	else return;
	socket.send(JSON.stringify(controller));
});

document.addEventListener('keyup', event => {
	if (event.keyCode === 37) controller.left = false;
	if (event.keyCode === 38) controller.top = false;
	if (event.keyCode === 39) controller.right = false;
	if (event.keyCode === 40) controller.bottom = false;
	if (event.keyCode === 32) controller.shoot = false;
	socket.send(JSON.stringify(controller));
});
