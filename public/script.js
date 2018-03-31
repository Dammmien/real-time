const name = prompt("Please enter your name", undefined);
const HOST = location.origin.replace('http', 'ws') + (name ? `?name=${name.substring(0, 10)}`: '');
const socket = new WebSocket(HOST);
const store = new Store({users: [], missiles: [], bonus: [], timer: ''});
const app = new App();

socket.onopen = () => console.log( 'open' );

socket.onmessage = (event) => {
	event = JSON.parse(event.data);

	if (event.name === 'game_setup') {
		app.setup(event.data);
	} else if (event.name === 'game_update') {
    store.set('users', event.data.users.map(user => new User(user)));
    store.set('missiles', event.data.missiles.map(missile => new Missile(missile)));
    store.set('bonus', event.data.bonus.map(bonus => new Bonus(bonus)));
    store.set('timer', event.data.time);
		if (event.data.status === 'finished') app.canvas.hide();
	}
};

window.addEventListener('beforeunload', () => {
	socket.close();
});

const controller = {
	left: false,
	top: false,
	right: false,
  bottom: false,
	shoot: false
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
	else if (event.keyCode === 38) controller.top = false;
	else if (event.keyCode === 39) controller.right = false;
	else if (event.keyCode === 40) controller.bottom = false;
	else if (event.keyCode === 32) controller.shoot = false;
  else return;
	socket.send(JSON.stringify(controller));
});
