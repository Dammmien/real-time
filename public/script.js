const name = prompt("Please enter your name", undefined);
const HOST = location.origin.replace('http', 'ws') + (name ? `?name=${name.substring(0, 10)}`: '');
const socket = new WebSocket(HOST);

const usersReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_USERS':
      return action.users;
    default:
      return state;
  }
};

const bonusReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_BONUS':
      return action.bonus;
    default:
      return state;
  }
};

const missilesReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_MISSILES':
      return action.missiles;
    default:
      return state;
  }
};

const timerReducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_TIMER':
      return action.timer;
    default:
      return state;
  }
};

const reducers = (state = {}, action) => {
  return {
    users: usersReducer(state.users, action),
    bonus: bonusReducer(state.bonus, action),
    missiles: missilesReducer(state.missiles, action),
    timer: timerReducer(state.timer, action)
  };
};

const store = Redux.createStore(reducers, {users: [], missiles: [], bonus: []});
let app = new App();

socket.onopen = () => console.log( 'open' );

socket.onmessage = (event) => {
	event = JSON.parse(event.data);

	if (event.name === 'game_setup') {
		app.setup(event.data);
	} else if (event.name === 'game_update') {
		store.dispatch({type: 'SET_USERS', users: event.data.users.map(user => new User(Object.assign(user)))});
		store.dispatch({type: 'SET_BONUS', bonus: event.data.bonus.map(bonus => new Bonus(Object.assign(bonus)))});
		store.dispatch({type: 'SET_MISSILES', missiles: event.data.missiles.map(missile => new Missile(Object.assign(missile)))});
		store.dispatch({type: 'SET_TIMER', timer: event.data.time});
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
