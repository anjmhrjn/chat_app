const Message = require("../../models/message.model");
const { encryptMessage, decryptMessage } = require("../../utils/encryption");

exports.saveMessage = async function ({
  roomCode,
  username,
  guestId,
  message,
}) {
  await Message.create({
    roomCode: roomCode,
    senderUsername: username,
    senderGuestId: guestId,
    message: encryptMessage(message),
  });
};

exports.getAllMessages = async function ({ roomCode }) {
  const messages = await Message.find({ roomId });

  const decryptedMessages = messages.map((msg) => ({
    ...msg._doc,
    message: decryptMessage(msg.message),
  }));
  return decryptedMessages;
};
