let Expense = require("../models/Expenses");
let userController = require("../controller/User");
const Razorpay = require("razorpay");
const Order = require('../models/Order')

exports.purchasePremium = async (req, res, next) => {
    try {
        console.log("Yukta working.")
        let rzp = new Razorpay({
            key_id: 'rzp_test_0jPnIKBd5S1mUz',
            key_secret: 'FWxmWa0lTu5mAgsLuKt7Srjz'
        })
        const amount = 9999;
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
    try {
        let userId = req.user.id;
        const username = req.user.username;
        const orderId = req.body.orderId;
        const paymentId = req.body.payment_id;

        console.log(orderId, "Order hai");
        const order = await Order.findOne({
            where: {
                orderId
            }
        })
        const promise1 = await order.update({ paymentId, status: "Successful" });
        const promise2 = await req.user.update({ isPremium: true });
        Promise.all([promise1, promise2])
        res.status(200).json({
            message: "Transaction Successful.",
            token: userController.generateAccessToken(userId, username, true)
        })

    } catch (error) {
        res.status(403).json({ message: 'Something went wrong' })
    }
}