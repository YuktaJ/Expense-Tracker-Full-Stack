const express = require("express");
const userAuthentication = require('../middleware/auth')


const router = express.Router();
const expenseController = require("../controller/Expenses")

router.post("/expenses", userAuthentication.authenticate, expenseController.postAddExpenses);
router.get("/expenses", userAuthentication.authenticate, expenseController.getExpenses);
router.delete("/deleteExpense/:id", userAuthentication.authenticate, expenseController.deleteExpense);
router.get("/downloadedExp", userAuthentication.authenticate, expenseController.downloadExp);
router.get("/downloadhistory", userAuthentication.authenticate, expenseController.dowloadhistory);
module.exports = router;