const router = require("express").Router()
const { getAllMessagesController } = require("../controllers/message/message.controller")
const authenticateToken = require("../middleware/auth/authenticateToken")

router.use(authenticateToken)
router.get("/get-all-messages/:roomCode", getAllMessagesController)

module.exports = router