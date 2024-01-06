const Sequelize = require("sequelize");
const sequelize = require("../connections/database");

const User = sequelize.define("user", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,

    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    isPremium: {
        type: Sequelize.BOOLEAN,
    },
    totalExpenses: {
        type: Sequelize.INTEGER,
    }
})

module.exports = User;