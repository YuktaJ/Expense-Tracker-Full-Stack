const express = require("express");

const router = express.Router();
const expenseController = require("../controller/Expenses")
router.post("/expenses", expenseController.postAddExpenses);
router.get("/expenses", expenseController.getExpenses);
router.delete("/deleteExpense/:id",expenseController.deleteExpense);
module.exports = router;