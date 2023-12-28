
const Expense = require("../models/Expenses");

exports.postAddExpenses = async (req, res) => {
    let category = req.body.category;
    let description = req.body.description;
    let price = req.body.price;
    let userId = req.user.id;

    try {
        let result = await Expense.create({
            category, description, price, userId
        })
        res.status(201).json({
            result
        })
    } catch (error) {
        res.status(500).json({
            err: "Something went wrong."
        })
    }
}

exports.getExpenses = async (req, res) => {
    try {
        let expenses = await Expense.findAll({
            where: {
                userId: req.user.id
            }
        });
        res.status(201).json({
            expenses
        })
    } catch (error) {
        res.status(500).json({
            err: "Something went wrong."
        })
    }
}

exports.deleteExpense = async (req, res) => {
    try {
        let id = req.params.id;
        Expense.destroy({
            where: {
                id: id,
                userId: req.user.id
            }
        })

    } catch (error) {
        res.status(500).json({
            err: "Something went wrong."
        })
    }
}

