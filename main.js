const url = require('url');
const Game = require('./Game');
const GameMap = require('./Map');
const Server = require('./Server');
const server = new Server(process.env.PORT || 8000);
const WebSocket = require('ws');
const webSocketServer = new WebSocket.Server({ server: server.httpServer });

process.on('warning', e => console.warn(e.stack));

const game = new Game({
	map: new GameMap({ height: 1400, width: 2000 })
});

webSocketServer.on('connection', (socket, req) => {
  const name = url.parse(req.url, true).query.name;
  const user = game.createPlayer(name, socket);
	user.send('game_setup', game.map);
});

game.start();
