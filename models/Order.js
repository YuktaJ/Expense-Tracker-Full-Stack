const sequelize = require("../connections/database");
const Sequelize = require("sequelize");

const Order = sequelize.define("order", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    paymentId: {
        type: Sequelize.STRING
    },
    orderId: {
        type: Sequelize.STRING
    },
    status: {
        type: Sequelize.STRING
    }
})

module.exports = Order;
