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

exports.joinRoom = async function ({ roomId, guestId }) {
  const findRoom = await Room.findOne({ roomCode: roomId });
  if (!findRoom) {
    throw new Error("Room not found!");
  }
  if (findRoom && findRoom?.members?.length == 10) {
    throw new Error("Maximum members in a room exceeded!")
  }
  const room = await Room.findOneAndUpdate(
    {
      roomCode: roomId,
      members: { $ne: guestId },
    },
    { $push: { members: guestId } },
    { new: true }
  );
};

exports.leaveRoom = async function ({ roomId, guestId }) {
  const room = await Room.findOneAndUpdate(
    {
      roomCode: roomId,
      members: guestId,
    },
    { $pull: { members: guestId } },
    { new: true }
  );
  if (room.members.length === 0 && room.isActive) {
    await Room.updateOne({ roomCode: roomId }, { $set: { isActive: false } });
  }
};
