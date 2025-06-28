const Room = require("../../models/room.model");
const { getAllMessages } = require("../../services/message/messageService");

exports.getAllMessagesController = async function (req, res, next) {
  try {
    const room = await Room.findOne({
      roomCode: req.params.roomCode,
      isActive: true,
      members: req.user.guestId,
    });
    if (!room) {
      return res.json({
        success: false,
        message: "You are not a member of this room!",
      });
    }
    let messages = await getAllMessages({
      roomCode: req.params.roomCode,
    });
    return res.json({
      success: true,
      messages: messages,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
