const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;
const { generateGuestId } = require("../utils/generateGuestId");
const { saveMessage } = require("../services/message/messageService");
const Room = require("../models/room.model");
const { leaveRoom } = require("../services/room/roomService");
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
    socket.on("clientReady", () => {
      if (!socket.user) {
        socket.emit("needUsername");
      }
    });

    socket.on("setUsername", ({ username }) => {
      try {
        const guestId = generateGuestId();

        // Issue new token
        const token = jwt.sign({ guestId, username }, SECRET, {
          expiresIn: "1h",
        });

        socket.user = { guestId, username, rooms: new Set() };
        socket.emit("tokenIssued", { token, userInfo: { guestId, username } });
      } catch (err) {
        socket.emit("error", err);
      }
    });

    socket.on("refreshTokenRequest", () => {
      try {
        let userInfo = {
          username: socket.user.username,
          guestId: socket.user.guestId,
        };
        const token = jwt.sign(userInfo, SECRET, {
          expiresIn: "1h",
        });
        socket.emit("tokenIssued", { token, userInfo: userInfo });
      } catch (err) {
        socket.emit("error", err);
      }
    });

    socket.on("joinRoom", ({ roomCode }) => {
      try {
        socket.join(roomCode);
        socket.user.rooms.add(roomCode);
        io.to(roomCode).emit("userJoined", {
          roomCode: roomCode,
          username: socket.user.username,
          guestId: socket.user.guestId,
        });
      } catch (err) {
        socket.emit("error", err);
      }
    });

    socket.on("sendMessage", async ({ roomCode, message }) => {
      try {
        const { username, guestId } = socket.user;
        if (!username || !guestId || !roomCode) {
          socket.emit("error", "Error sending message");
          return;
        }
        const room = await Room.findOne({
          roomCode: roomCode,
          members: guestId,
          members: { $elemMatch: { guestId } },
          isActive: true,
        });
        if (!room) {
          socket.emit("error", "You are not a member of this room.");
          return;
        }
        await saveMessage({ roomCode, username, guestId, message });
        io.to(roomCode).emit("newMessage", {
          message,
          senderUsername: socket.user.username,
          senderGuestId: socket.user.guestId,
        });
      } catch (err) {
        socket.emit("error", err);
      }
    });

    socket.on("leaveRoom", ({ roomCode }) => {
      try {
        socket.leave(roomCode);
        socket.user.rooms.delete(roomCode);
        io.to(roomCode).emit("userLeft", {
          username: socket.user.username,
          guestId: socket.user.guestId,
        });
      } catch (err) {
        socket.emit("error", err);
      }
    });

    socket.on("disconnect", async () => {
      try {
        let rooms = socket?.user?.rooms || [];
        for (const roomCode of rooms) {
          await leaveRoom({ roomCode, guestId: socket.user.guestId });
          io.to(roomCode).emit("userLeft", {
            guestId: socket.user.guestId,
            username: socket.user.username,
          });
        }
      } catch (err) {
        socket.emit("error", err);
      }
    });
  });
};
