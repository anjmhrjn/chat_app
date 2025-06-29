const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let messageSchema = new Schema(
  {
    roomCode: {
      type: String,
      required: true,
    },
    senderUsername: {
      type: String,
      required: true,
    },
    senderGuestId: {
      type: String,
      required: true,
    },
    message: { type: String, required: true },
    sentAt: {type: Date, default: Date.now}
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);
Message.createIndexes();
module.exports = Message;
