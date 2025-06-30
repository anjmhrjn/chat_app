const Room = require("../../models/room.model");
const { generateUniqueRoomCode } = require("../../utils/generateRoomCode");

exports.createRoom = async function ({ username, guestId }) {
  try {
    const roomCode = await generateUniqueRoomCode();
    const room = await Room.create({
      roomCode: roomCode,
      createdBy: username,
      guestId: guestId,
    });
    return room;
  } catch (err) {
    throw new Error(err)
  }
};

exports.joinRoom = async function ({ roomCode, username, guestId }) {
  try {
    const findRoom = await Room.findOne({ roomCode: roomCode, isActive: true });
    if (!findRoom) {
      throw new Error("Room not found!");
    }
    if (findRoom && findRoom?.members?.length == 10) {
      throw new Error("Maximum members in a room exceeded!");
    }
    await Room.findOneAndUpdate(
      {
        roomCode: roomCode,
        "members.guestId": { $ne: guestId },
      },
      { $push: { members: { username: username, guestId: guestId } } },
      { new: true }
    );
  } catch (err) {
    throw new Error(err)
  }
};

exports.leaveRoom = async function ({ roomCode, guestId }) {
  try {
    const room = await Room.findOneAndUpdate(
      {
        roomCode: roomCode,
      },
      { $pull: { members: { guestId: guestId } } },
      { new: true }
    );
    if (room?.members?.length === 0 && room?.isActive) {
      await Room.updateOne(
        { roomCode: roomCode },
        { $set: { isActive: false } }
      );
    }
  } catch (err) {
    throw new Error(err)
  }
};
