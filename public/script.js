const name = prompt("Please enter your name", undefined);
const HOST = location.origin.replace('http', 'ws') + (name ? `?name=${name.substring(0, 10)}`: '');
const socket = new WebSocket(HOST);
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
		game.map = {
			height: event.data.height,
			width: event.data.width
		};
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
  game.users.forEach( user => {
  	user.render();
  	if (user.isMe) {
  		canvas.style.left = `${-user.x + window.innerWidth / 2}px`;
  		canvas.style.top = `${-user.y + window.innerHeight / 2}px`;
  	}
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
	if (event.keyCode === 37) controller.left = true;
	if (event.keyCode === 38) controller.top = true;
	if (event.keyCode === 39) controller.right = true;
	if (event.keyCode === 40) controller.bottom = true;
	if (event.keyCode === 32) controller.shoot = true;
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
