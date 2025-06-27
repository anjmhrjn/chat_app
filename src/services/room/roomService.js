const Room = require("../../models/room.model");
const { generateUniqueRoomCode } = require("../../utils/generateRoomCode");

exports.createRoom = async function ({ username, guestId }) {
  const roomCode = await generateUniqueRoomCode();
  const room = await Room.create({
    roomCode: roomCode,
    createdBy: username,
    guestId: guestId,
    members: [guestId],
  });
  return room;
};
