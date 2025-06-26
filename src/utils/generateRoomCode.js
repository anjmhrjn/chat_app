const Room = require("../models/room.model");

async function generateUniqueRoomCode(length = 6) {
  let code;
  let exists = true;

  while (exists) {
    code = generateRandomCode(length);
    exists = await Room.findOne({ code });
  }

  return code;
}

function generateRandomCode(length = 7) {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

module.exports = { generateUniqueRoomCode };
