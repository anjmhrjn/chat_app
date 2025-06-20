const cors = require('cors')

// parse from .env file
const DEV_CORS = JSON.parse(process.env.DEV_CORS)
const PROD_CORS = JSON.parse(process.env.PROD_CORS)

module.exports = app => {
  // allow only limited origin in development and production environmnets
  process.env.NODE_ENV_PRODUCTION == 'true'
    ? app.use(
        cors({
          origin: PROD_CORS,
          credentials: true,
        })
      )
    : app.use(
        cors({
          origin: DEV_CORS,
          credentials: true,
        })
      )
}
