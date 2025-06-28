const router = require("express").Router()
const { createRoomController, joinRoomController, leaveRoomController } = require("../controllers/room/room.controller")
const authenticateToken = require("../middleware/auth/authenticateToken")

router.use(authenticateToken)
router.post("/", createRoomController)
router.post("/join-room", joinRoomController)
router.post("/leave-room", leaveRoomController)

module.exports = router