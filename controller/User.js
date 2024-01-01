const User = require("../models/User");
const bcrypt = require("bcrypt"); // encrypting the password 
const jwt = require("jsonwebtoken");
const sequelize = require("../connections/database");

exports.generateAccessToken = (id, name, isPremium) => {
    return jwt.sign({ id, name, isPremium }, "secretKey");
};

exports.postSingUp = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;

        const saltrounds = 10;
        const hash = await bcrypt.hash(password, saltrounds); // Hash the password synchronously

        await User.create({
            username,
            email,
            password: hash
        }, { transaction: t });

        await t.commit();
        return res.status(201).json({
            message: "User created successfully."
        });
    } catch (error) {
        await t.rollback();
        res.status(500).json({
            message: "User creation failed."
        });
    }
};

exports.postLogin = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        let email = req.body.email;
        let password = req.body.password;

        let user = await User.findOne({
            where: { email },
            transaction: t
        });

        if (!user) {
            return res.status(404).json({
                message: "User doesn't exist.",
                success: false
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Incorrect Password"
            });
        } else {
            await t.commit();
            return res.status(201).json({
                token: exports.generateAccessToken(user.id, user.username, user.isPremium),
                message: "User logged in successfully.",
                success: true
            });
        }
    } catch (error) {
        await t.rollback();
        res.status(500).json({
            message: "Login failed."
        });
    }
};
