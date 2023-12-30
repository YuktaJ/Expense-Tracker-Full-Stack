
const Expense = require("../models/Expenses");
const User = require("../models/User");
exports.postAddExpenses = async (req, res) => {
    let category = req.body.category;
    let description = req.body.description;
    let price = req.body.price;
    let userId = req.user.id;
    let totalExpenses = req.user.totalExpenses;

    try {
        if (totalExpenses === null) {
            totalExpenses = 0;
        }
        price = Number.parseInt(price);

        totalExpenses += price;
        console.log(totalExpenses);

        let result = await Expense.create({
            category, description, price, userId
        })
        await User.update({
            totalExpenses
        }, {
            where: {
                id: req.user.id
            }
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
    let totalExpenses = req.user.totalExpenses;

    try {
        if (totalExpenses === null) {
            totalExpenses = 0;
        }

        let id = req.params.id;
        let price = await Expense.findByPk(id);
        price = Number.parseInt(price.price);
        console.log(price);
        totalExpenses = totalExpenses - price
        await Expense.destroy({
            where: {
                id: id,
                userId: req.user.id
            }
        })

        await User.update({
            totalExpenses
        }, {
            where: {
                id: req.user.id
            }
        })

    } catch (error) {
        res.status(500).json({
            err: "Something went wrong."
        })
    }
}

