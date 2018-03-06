const User = require('./User');
const Game = require('./Game');
const Server = require('./Server');
const server = new Server(process.env.PORT || 8000);
const WebSocket = require('ws');
const webSocketServer = new WebSocket.Server({ server: server.httpServer });

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
		x: Math.random() * game.map.width,
		y: Math.random() * game.map.height,
		socket,
		game
	});
	game.users.push(user);
	user.send('game_setup', game.map);
});


setInterval(() => {
	game.users.forEach(user => user.update());
	game.missiles.forEach(missile => missile.update());
	game.missiles.forEach(missile => {
		const collisionUser = game.users.find(user => user.contains(missile));
		if (collisionUser) {
			collisionUser.life -= missile.power;
			if (collisionUser.life <= 0) {
				collisionUser.deaths += 1;
				missile.user.kills += 1;
			}
			missile.destroy();
		}
	});
}, 15);

setInterval(() => {
	game.users.forEach(user => {
		user.send('game_update', {
			users: game.users.map(x => Object.assign({ isMe: user === x }, x.data)),
			missiles: game.missiles.map(missile => missile.data)
		});
	});
}, 45);
