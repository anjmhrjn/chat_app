const { createRoom } = require("../../services/room/roomService");

exports.createRoomController = async function (req, res, next) {
  try {
    let roomCode = await createRoom({
      username: req.user.username,
      guestId: req.user.guestId,
    });
    // join room
    return res.json({
      success: true,
      roomCode,
      message: "Room created successfully",
    });
  } catch (error) {
    next(error);
  }
};
