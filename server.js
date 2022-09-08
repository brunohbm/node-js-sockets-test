const { startSocketConnection } = require('./sockets');
const api = require('./api');
const http = require('http');
const socketIo = require('socket.io');

const PORT = 3000;
const httpServer = http.createServer(api);
const socketServer = socketIo(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

httpServer.listen(PORT);
console.log(`Listening on port ${PORT}...`);

startSocketConnection(socketServer);