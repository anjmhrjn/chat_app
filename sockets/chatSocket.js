const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;
const { generateGuestId } = require("../utils/generateGuestId");
// const chatService = require('../services/chatService');

module.exports = (io) => {
  io.use((socket, next) => {
    const { auth } = socket.handshake;

    if (auth && auth.token) {
      try {
        const payload = jwt.verify(auth.token, SECRET);
        socket.user = {
          guestId: payload?.guestId,
          username: payload?.username,
        };
        return next();
      } catch (err) {
        return next(new Error("Invalid token"));
      }
    }
    socket.user = null;
    next();
  });

  // io.use((socket, next) => {
  //   // intercept every emit from the frontend
  // });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    if (!socket.user) {
      socket.emit("needUsername");
    }

    socket.on("setUsername", ({username}) => {
      console.log(username)
      const guestId = generateGuestId();

      // Issue new token
      const token = jwt.sign({ guestId, username }, SECRET, {
        expiresIn: "1h",
      });

      socket.user = { guestId, username };
      socket.emit("tokenIssued", { token, userInfo: { guestId, username } });
    });

    socket.on("joinRoom", async ({ roomId }) => {
      socket.join(roomId);
      console.log(roomId);
      console.log(socket.user.username);
      console.log("Room joined");
      //   await chatService.joinRoom(socket, roomId, username);
    });

    socket.on("sendMessage", async ({ roomId, message }) => {
      console.log("Message sent");
      //   await chatService.handleMessage(io, socket, roomId, message);
    });

    socket.on("leaveRoom", ({ roomId }) => {
      socket.leave(roomId);
      console.log(`${socket.user.username} left room ${roomId}`);
    });

    socket.on("disconnect", () => {
      //   chatService.handleDisconnect(io, socket);
      console.log("Disconnected");
    });
  });
};
