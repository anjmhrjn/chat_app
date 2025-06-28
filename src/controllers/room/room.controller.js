const {
  createRoom,
  joinRoom,
  leaveRoom,
} = require("../../services/room/roomService");

exports.createRoomController = async function (req, res, next) {
  try {
    let room = await createRoom({
      username: req.user.username,
      guestId: req.user.guestId,
    });
    // join room
    return res.json({
      success: true,
      roomCode: room.roomCode,
      message: "Room created successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.joinRoomController = async function (req, res, next) {
  try {
    await joinRoom({ roomId: req.body.roomId, guestId: req.user.guestId });
    return res.json({
      success: true,
      message: "Room joined successfully!",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.leaveRoomController = async function (req, res, next) {
  try {
    await leaveRoom({ roomId: req.body.roomId, guestId: req.user.guestId });
    return res.json({
      success: true,
      message: "Room left successfully!"
    })
  } catch (err) {
    console.log(err);
    next(err);
  }
};
