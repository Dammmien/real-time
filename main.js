const User = require('./User');
const Game = require('./Game');
const server = require('./Server');
const WebSocket = require('ws');
const webSocketServer = new WebSocket.Server({ server });

const game = new Game({
	users: [],
	missiles: [],
	map: {
		height: 3000,
		width: 4000
	}
});

webSocketServer.on('connection', socket => {
	const user = new User({
		id: Math.random().toString(36).substr(2),
		socket,
		game
	});
	game.users.push(user);
	console.log( game.users.map( user => user.data ) );
	console.log( game.missiles.map( user => user.data ) );
	user.send('game_setup', game.map);
});


setInterval(() => {
	game.missiles.forEach(missile => missile.update());
	game.users.forEach(user => user.update());
}, 15);

setInterval(() => {
	game.users.forEach(user => {
		user.send('game_update', {
			users: game.users.map(user => user.data),
			missiles: game.missiles.map(missile => missile.data)
		});
	});
}, 45);
