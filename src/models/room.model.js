const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let roomSchema = new Schema(
  {
    roomCode: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    guestId: {
      type: String,
      required: true,
    },
    members: [{ type: String }],
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model("Room", roomSchema);
Room.createIndexes();
module.exports = Room;
