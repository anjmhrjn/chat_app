// db to use
const DB_TO_USE = process.env.NODE_ENV_PRODUCTION === 'true' ? process.env.MONGO_DB_LOCAL : process.env.MONGO_DB_REMOTE
module.exports = {
  DB_TO_USE,
}
