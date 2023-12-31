const sequelize = require("../connections/database");
const resetPassword = require("../models/ResetPassword");
const User = require("../models/User");
const Sib = require("sib-api-v3-sdk");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const { use } = require("../routes/User");

exports.resetPassword = async (req, res) => {
    const t = sequelize.transaction();

    try {
        let email = req.body.email;
        let user = await User.findOne(
            {
                where: {
                    email: email
                }
            })
        if (user) {
            const id = uuid.v4();
        }
    } catch (error) {

    }
}