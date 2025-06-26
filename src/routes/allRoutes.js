const roomRouter = require("./room.routes");
module.exports = (app) => {
  app.use("/room", roomRouter);
};
