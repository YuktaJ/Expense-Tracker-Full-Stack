const sequelize = require("../connections/database");
const AWS = require("aws-sdk");
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
function uploadToS3(data, file) {
    const BUCKET_NAME = "expensetracker1820";
    const IAM_USER_KEY = process.env.IAM_KEY;
    const IAM_USER_SECRET = process.env.IAM_SECRETKEY;

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
        Bucket: BUCKET_NAME
    })
    let params = {
        Bucket: BUCKET_NAME,
        Key: file,
        Body: data,
        ACL: "public-read"
    }
    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (error, result) => {
            if (error) {
                reject("Error in uploading file");
            } else {
                resolve(result.Location);
            }
        })
    })
}
exports.downloadExp = async (req, res) => {
    try {
        const expenses = await req.user.getExpenses();
        const stringyfyExp = JSON.stringify(expenses);
        const fileName = "Expense.txt";
        const fileUrl = await uploadToS3(stringyfyExp, fileName)
        res.status(200).json({
            fileUrl
        })
    } catch (error) {
        console.log(error)
    }
}