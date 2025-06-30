const Message = require("../../models/message.model");
const { encryptMessage, decryptMessage } = require("../../utils/encryption");

exports.saveMessage = async function ({
  roomCode,
  username,
  guestId,
  message,
}) {
  try {
    await Message.create({
      roomCode: roomCode,
      senderUsername: username,
      senderGuestId: guestId,
      message: encryptMessage(message),
    });
  } catch (err) {
    throw new Error(err)
  }
};

exports.getAllMessages = async function ({ roomCode }) {
  try {
    const messages = await Message.find({ roomCode });

    const decryptedMessages = messages.map((msg) => ({
      ...msg._doc,
      type: "chat",
      message: decryptMessage(msg.message),
    }));
    return decryptedMessages;
  } catch (err) {
    throw new Error(err)
  }
};
