// const chatService = require('../services/chatService');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinRoom', async ({ roomId, username }) => {
        console.log(roomId, username)
        console.log("Room joined")
    //   await chatService.joinRoom(socket, roomId, username);
    });

    socket.on('sendMessage', async ({ roomId, message }) => {
        console.log("Message sent")
    //   await chatService.handleMessage(io, socket, roomId, message);
    });

    socket.on('disconnect', () => {
    //   chatService.handleDisconnect(io, socket);
    console.log("Disconnected")
    });
  });
};
