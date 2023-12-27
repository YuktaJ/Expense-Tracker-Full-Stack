const express = require("express");
const router = express.Router();
const userController = require("../controller/User");


router.post("/signup", userController.postSingUp);
router.post("/login",userController.postLogin);

module.exports = router;