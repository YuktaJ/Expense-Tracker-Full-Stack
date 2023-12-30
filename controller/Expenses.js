const sequelize = require("../connections/database");
const Expense = require("../models/Expenses");
const User = require("../models/User");

exports.postAddExpenses = async (req, res) => {
    const t = await sequelize.transaction()

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
        }, { transaction: t })
        await User.update({
            totalExpenses
        }, {
            where: {
                id: req.user.id

            }, transaction: t
        })
        await t.commit();

        res.status(201).json({
            result
        })

    } catch (error) {
        await t.rollback();
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
    const t = await sequelize.transaction();
    try {
        if (totalExpenses === null) {
            totalExpenses = 0;
        }

        let id = req.params.id;
        let price = await Expense.findByPk(id);
        price = Number.parseInt(price.price);
       
        totalExpenses = totalExpenses - price
        await Expense.destroy({
            where: {
                id: id,
                userId: req.user.id
            },transaction:t
        })

        await User.update({
            totalExpenses
        }, {
            where: {
                id: req.user.id
            },transaction:t
        })
        await t.commit();

    } catch (error) {
        await t.rollback();
        res.status(500).json({
            err: "Something went wrong."
        })
    }
}

