const mongoose = require("mongoose");
const { DB_TO_USE } = require("../constants/__db");

module.exports = () => {
  // mongoose to use Promises
  mongoose.Promise = global.Promise
  // connect to database
  return mongoose.connect(DB_TO_USE)
}
