const User = require("../models/User");
const { use } = require("../routes/User");

exports.postSingUp = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;

        let user = await User.create({
            username,
            email,
            password
        })
        if (user) {
            res.status(201).json({
                message: "User created successfully."
            })
        }
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
        } else {
            let result = await User.findOne({
                where: {
                    password: password,
                    email: email
                }
            })
            if (result) {
                res.status(201).json({
                    message: "User logged in successfully.",
                    success: true
                })
            } else {
                res.status(401).json({
                    message: "Incorrect Password."
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong."
        })
    }
}