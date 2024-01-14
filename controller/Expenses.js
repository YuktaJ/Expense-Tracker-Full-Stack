const sequelize = require("../connections/database");
//aws cloud connection to fetch and upload data to s3 bucket
const AWS = require("aws-sdk");
const S3Services = require("../services/S3services");

const userServices = require("../services/userservices");
const Expense = require("../models/Expenses");
const Download = require("../models/Downloadfiles");
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
            category: category,
            description: description,
            price: price,
            userId: userId
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
    let itemPerPage = 4;
    try {
        let page = Number.parseInt(req.query.page) || 1;
        itemPerPage = Number.parseInt(req.query.item) || 5;
        let totalExpenses = await Expense.count({ where: { userid: req.user.id } })
        let expenses = await Expense.findAll({
            where: {
                userId: req.user.id,
            },
            offset: (page - 1) * itemPerPage,
            limit: itemPerPage
        });
        res.status(201).json({
            expenses,
            currentPage: page,
            hasPreviousPage: page > 1,
            hasNextPage: (page * itemPerPage) < totalExpenses,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalExpenses / itemPerPage)
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
            }, transaction: t
        })

        await User.update({
            totalExpenses
        }, {
            where: {
                id: req.user.id
            }, transaction: t
        })
        await t.commit();
    } catch (error) {
        await t.rollback();
        res.status(500).json({
            err: "Something went wrong."
        })
    }
}

exports.downloadExp = async (req, res) => {

    try {
        const userId = req.user.id;
        let currDate = new Date();
        currDate = currDate.toISOString().split('T')[0];
        const expenses = await userServices.getExpenses(req);
        const stringyfyExp = JSON.stringify(expenses);
        const fileName = `expense${userId}/${currDate}_${req.user.username}.txt`;
        console.log("Filename:", fileName)
        const fileUrl = await S3Services.uploadToS3(stringyfyExp, fileName)
        await Download.create({
            userId,
            url: fileUrl,
            date: currDate
        })
        console.log(fileUrl)
        res.status(200).json({
            fileUrl, fileName
        })
    } catch (error) {
        console.log(error)
    }
}

exports.dowloadhistory = async (req, res) => {
    console.log("Happy working")
    try {
        let userId = req.user.id;
        let files = await Download.findAll(
            {
                where: {
                    userId
                }
            }
        )
        res.status(201).json({
            files
        })
    } catch (error) {
        return res.status(500).json({
            error: "Something went wrong"
        })
    }
}