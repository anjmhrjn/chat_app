const CORS_TO_USE = process.env.NODE_ENV_PRODUCTION === 'true' ? process.env.DEV_CORS : process.env.PROD_CORS
module.exports = {
  CORS_TO_USE,
}
