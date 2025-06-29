const Room = require("../../models/room.model");
const { generateUniqueRoomCode } = require("../../utils/generateRoomCode");

exports.createRoom = async function ({ username, guestId }) {
  const roomCode = await generateUniqueRoomCode();
  const room = await Room.create({
    roomCode: roomCode,
    createdBy: username,
    guestId: guestId,
  });
  return room;
};

exports.joinRoom = async function ({ roomCode, username, guestId }) {
  const findRoom = await Room.findOne({ roomCode: roomCode, isActive: true });
  if (!findRoom) {
    throw new Error("Room not found!");
  }
  if (findRoom && findRoom?.members?.length == 10) {
    throw new Error("Maximum members in a room exceeded!")
  }
  await Room.findOneAndUpdate(
    {
      roomCode: roomCode,
      "members.guestId": { $ne: guestId },
    },
    { $push: { members: {username: username, guestId: guestId} } },
    { new: true }
  );
};

exports.leaveRoom = async function ({ roomCode, guestId }) {
  const room = await Room.findOneAndUpdate(
    {
      roomCode: roomCode,
    },
    { $pull: { members: {guestId: guestId} } },
    { new: true }
  );
  if (room?.members?.length === 0 && room?.isActive) {
    await Room.updateOne({ roomCode: roomCode }, { $set: { isActive: false } });
  }
};
