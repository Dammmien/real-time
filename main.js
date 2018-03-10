const url = require('url');
const User = require('./User');
const Game = require('./Game');
const Server = require('./Server');
const server = new Server(process.env.PORT || 8000);
const WebSocket = require('ws');
const webSocketServer = new WebSocket.Server({ server: server.httpServer });

const game = new Game({
	map: {
		height: 1400,
		width: 2000
	}
});

webSocketServer.on('connection', (socket, req) => {
  const name = url.parse(req.url, true).query.name;

	const user = new User({
		id: Math.random().toString(36).substring(2, 12),
		x: Math.random() * game.map.width,
		y: Math.random() * game.map.height,
		name,
		socket,
		game
	});

	game.users.push(user);

	user.send('game_setup', game.map);
});

game.start();
