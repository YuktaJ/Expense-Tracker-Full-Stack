let Expense = require("../models/Expenses");
let userController = require("../controller/User");
const Razorpay = require("razorpay");
const Order = require('../models/Order');
const sequelize = require("../connections/database");

exports.purchasePremium = async (req, res, next) => {
    try {

        let rzp = new Razorpay({
            key_id: 'rzp_test_47f2CGXiHPEtCB',
            key_secret: 'zzdXe1jH5VHEs5gekzmTLYah'
        })
        const amount = 2500;
        rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
            if (err) {
                throw new Error("Something went wrong.");
            }
            req.user.createOrder({ orderId: order.id, status: 'PENDING' })
            res.status(201).json({ order, key_id: rzp.key_id });

        })
    } catch (error) {
        res.status(403).json({ message: 'Something went wrong' })
    }
}

exports.updateTransaction = async (req, res) => {
    const t = await sequelize.transaction()
    try {
        let userId = req.user.id;
        const username = req.user.username;
        const orderId = req.body.orderId;
        const paymentId = req.body.payment_id;

        console.log(orderId, "Order hai");
        const order = await Order.findOne({
            where: {
                orderId
            }, transaction: t
        })
        const promise1 = await order.update({ paymentId, status: "Successful" });
        const promise2 = await req.user.update({ isPremium: true });
        Promise.all([promise1, promise2])
        await t.commit(); //save transaction changes
        res.status(200).json({
            message: "Transaction Successful.",
            token: userController.generateAccessToken(userId, username, true)
        })

    } catch (error) {
        await t.rollback();
        res.status(403).json({ message: 'Something went wrong' })
    }
}