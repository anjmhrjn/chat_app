const SOCKET_CORS = process.env.NODE_ENV_PRODUCTION === 'true' ? process.env.DEV_CORS : process.env.PROD_CORS
module.exports = {
  SOCKET_CORS,
}
