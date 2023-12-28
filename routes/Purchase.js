let express = require("express");
let purchaseController = require("../controller/Purchase");
const userAuthentication = require('../middleware/auth');

let router = express.Router();

router.get("/premiumMembership", userAuthentication.authenticate, purchaseController.purchasePremium);
router.post("/updateTransaction", userAuthentication.authenticate, purchaseController.updateTransaction);
module.exports = router;