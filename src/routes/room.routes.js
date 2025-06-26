const router = require("express").Router()
const { createRoomController } = require("../controllers/room/room.controller")
const authenticateToken = require("../middleware/auth/authenticateToken")

router.use(authenticateToken)
router.post("/", createRoomController)

module.exports = router