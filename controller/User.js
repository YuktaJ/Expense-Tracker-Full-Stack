const User = require("../models/User");

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