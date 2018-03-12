const name = prompt("Please enter your name", undefined);
const HOST = location.origin.replace('http', 'ws') + (name ? `?name=${name.substring(0, 10)}`: '');
const socket = new WebSocket(HOST);

const usersReducer = (state = [], action) => {

  switch (action.type) {
    case 'SET_USERS':
      return action.users;
    default:
      return state
  }

};

const timerReducer = (state = '', action) => {

  switch (action.type) {
    case 'SET_TIMER':
      return action.timer;
    default:
      return state
  }

};

const reducers = (state = {}, action) => {
  return {
    users: usersReducer(state.users, action),
    timer: timerReducer(state.timer, action)
  };
}

const store = Redux.createStore(reducers, window.STATE_FROM_SERVER);

const app = new App();

let game = {
	context : app.canvas.context,
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

		app.canvas.setSize(game.map);
		app.canvas.show();
	} else if (event.name === 'game_update') {
		game.users = event.data.users.map(user => new User(Object.assign(user, {game})));
		game.missiles = event.data.missiles.map(missile => new Missile(Object.assign(missile, {game})));
		game.status = event.data.status;

		store.dispatch({type: 'SET_USERS', users: event.data.users.map(user => new User(Object.assign(user, {game})))});
		store.dispatch({type: 'SET_TIMER', timer: event.data.time});

		if (event.data.status === 'finished') app.canvas.hide();
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
  app.canvas.clear();
  game.users.forEach( user => {
  	user.render();
  	if (user.isMe) app.canvas.followUser(user);
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
