let readyPlayerCount = 0;

function startSocketConnection(socketServer) {
    const pongNamespace = socketServer.of('/pong');
    let room;

    pongNamespace.on('connection', socket => {
        room = 'room' + Math.floor(readyPlayerCount / 2);
        console.log('A user connected', socket.id, room);
        
        socket.join(room);

        socket.on('ready', () => {
            console.log('Player ready', socket.id);
    
            readyPlayerCount++;
            if(readyPlayerCount % 2 === 0) {
                pongNamespace.in(room).emit('startGame', socket.id);
            }
        });
    
        socket.on('paddleMove', paddleData => {
            // Emits for everone in the room, except you
            socket.to(room).emit('paddleMove', paddleData);
        });
    
        socket.on('ballMove', ballData => {
            socket.to(room).emit('ballMove', ballData);
        });

        socket.on('disconnect', reason => {
            console.log(`Client ${socket.id} disconnected: ${reason}`);
            socket.leave(room);
        })
    });
}

module.exports = {
    startSocketConnection,
};