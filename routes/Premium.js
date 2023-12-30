const express = require("express");
const router = express.Router();
const PremiumController = require("../controller/Premium");

router.get("/showLeaderBoard", PremiumController.getLeaderBoard);
module.exports = router;