const express = require("express");
const router = express.Router();
const userController = require("../controller/User");

router.post("/signup", userController.postSingUp)

module.exports = router;