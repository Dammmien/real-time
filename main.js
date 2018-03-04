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
	const user = new User({ socket, game });

	game.users.push(user);

	user.send('game_setup', game.map);
});


setInterval(() => {
	game.users.forEach(user => user.update());
	game.missiles.forEach( missile => missile.update() );
}, 15);

setInterval(() => {
	game.users.forEach(user => {
		user.send('game_update', {
			users: game.users.map(user => user.data),
			missiles: game.missiles.map(missile => missile.data)
		});
	});
}, 45);
