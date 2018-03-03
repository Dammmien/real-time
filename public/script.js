const socket = new WebSocket("ws://localhost:8080");

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

let game = {
	context,
	users: [],
	missiles: []
};

socket.onopen = () => {
	console.log( 'open' );
};

socket.onmessage = (event) => {
	event = JSON.parse(event.data);

	if (event.name === 'game_setup') {
		canvas.height = event.data.height;
		canvas.style.height = event.data.height;
		canvas.width = event.data.width;
		canvas.style.width = event.data.width;
	} else if (event.name === 'game_update') {
		game.users = event.data.users.map( user => new User(Object.assign(user, {game})) );
		game.missiles = event.data.missiles.map( missile => new Missile(Object.assign(missile, {game})) );
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
  context.clearRect(0, 0, 4000, 3000);

  game.users.forEach( user => user.render() );
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
	if (event.keyCode === 37) controller.left = true;
	if (event.keyCode === 38) controller.top = true;
	if (event.keyCode === 39) controller.right = true;
	if (event.keyCode === 40) controller.bottom = true;
	if (event.keyCode === 32) controller.shoot = true;
	socket.send(JSON.stringify(controller));
	event.preventDefault();
});

document.addEventListener('keyup', event => {
	if (event.keyCode === 37) controller.left = false;
	if (event.keyCode === 38) controller.top = false;
	if (event.keyCode === 39) controller.right = false;
	if (event.keyCode === 40) controller.bottom = false;
	if (event.keyCode === 32) controller.shoot = false;
	socket.send(JSON.stringify(controller));
});
