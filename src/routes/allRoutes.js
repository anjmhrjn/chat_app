const roomRouter = require("./room.routes");
const messageRouter = require("./message.routes");
module.exports = (app) => {
  app.use("/room", roomRouter);
  app.use("/message", messageRouter);
};
