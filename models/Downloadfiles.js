const sequelize = require("../connections/database");
const Sequelize = require("sequelize");

const Downloadfiles = sequelize.define("downloadfiles", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    url: {
        type: Sequelize.STRING,
        allowNull: false
    },
    date: {
        type: Sequelize.STRING,
        allowNull: false
    }
})
module.exports = Downloadfiles;