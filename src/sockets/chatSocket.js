const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;
const { generateGuestId } = require("../utils/generateGuestId");
const { saveMessage } = require("../services/message/messageService");
const Room = require("../models/room.model");
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
          rooms: new Set(),
        };
      } catch (err) {
        socket.emit("needUsername");
      }
      return next();
    }
    socket.user = null;
    next();
  });

  io.on("connection", (socket) => {
    if (!socket.user) {
      socket.emit("needUsername");
    }

    socket.on("setUsername", ({ username }) => {
      const guestId = generateGuestId();

      // Issue new token
      const token = jwt.sign({ guestId, username }, SECRET, {
        expiresIn: "1h",
      });

      socket.user = { guestId, username, roms: new Set() };
      socket.emit("tokenIssued", { token, userInfo: { guestId, username } });
    });

    socket.on("refreshTokenRequest", () => {
      let userInfo = {
        username: socket.user.username,
        guestId: socket.user.guestId,
      };
      const token = jwt.sign(userInfo, SECRET, {
        expiresIn: "1h",
      });
      socket.emit("tokenIssued", { token, userInfo: userInfo });
    });

    socket.on("joinRoom", ({ roomId }) => {
      socket.join(roomId);
      socket.user.rooms.add(roomId);
      io.to(roomId).emit("userJoined", {
        username: socket.user.username,
        guestId: socket.user.guestId,
      });
    });

    socket.on("sendMessage", async ({ roomId, message }) => {
      const { username, guestId } = socket.user;
      if (!username || !guestId || !roomId) {
        socket.emit("error", "Error sending message");
        return;
      }
      const room = await Room.findOne({
        roomCode: roomId,
        members: guestId,
        isActive: true,
      });
      if (!room) {
        socket.emit("error", "You are not a member of this room.");
        return;
      }
      await saveMessage({ roomId, username, guestId, message });
      io.to(roomId).emit("newMessage", {
        message,
        senderUsername: socket.user.username,
      });
    });

    socket.on("leaveRoom", ({ roomId }) => {
      socket.leave(roomId);
      socket.user.rooms.delete(roomId);
      io.to(roomId).emit("userLeft", {
        username: socket.user.username,
        guestId: socket.user.guestId,
      });
    });

    socket.on("disconnect", () => {
      for (const roomId of socket.user.rooms) {
        io.to(roomId).emit("userLeft", {
          guestId: socket.user.guestId,
          username: socket.user.username,
        });
      }
    });
  });
};
