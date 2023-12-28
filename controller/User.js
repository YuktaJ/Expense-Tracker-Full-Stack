const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


exports.generateAccessToken = (id, name, isPremium) => {
    return jwt.sign({ id, name, isPremium }, "secretKey");
}
exports.postSingUp = async (req, res) => {
    try {

        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;

        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            if (err) {
                return res.status(404).json({
                    message: "Incorrect password syntax."
                })
            }
            await User.create({
                username,
                email,
                password: hash
            });
        })
        res.status(201).json({
            message: "User created successfully."
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "User already exists."
        })
    }
}

exports.postLogin = async (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password;

        let user = await User.findOne({
            where: {
                email: email
            }
        })
        if (!user) {
            res.status(404).json({
                message: "User doesn't exists.",
                success: false
            })
        }
        console.log(user.password, password)
        let result = await bcrypt.compare(password, user.password)

        if (result === false) {
            return res.status(401).json({
                message: "Incorrect Password"
            })
        } else {
            return res.status(201).json({
                token: exports.generateAccessToken(user.id, user.username, user.isPremium),
                message: "User logged in successfully.",
                success: true
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong."
        })
    }
}