const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let roomSchema = new Schema(
  {
    roomCode: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    guestId: {
      type: String,
      required: true,
    },
    members: [
      {
        username: { type: String, required: true },
        guestId: { type: String, required: true },
      },
    ],
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

roomSchema.index({ "members.guestId": 1 });
const Room = mongoose.model("Room", roomSchema);
Room.createIndexes();
module.exports = Room;
