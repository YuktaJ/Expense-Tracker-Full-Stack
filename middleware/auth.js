const User = require('../models/User');

const jwt = require("jsonwebtoken");

exports.authenticate = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        console.log(token, "This is token");
        const user = jwt.verify(token, process.env.SECRETKEY);
        console.log(user);
        if (!user) {
            throw new Error("Invalid user in token");
        }
        let u = await User.findByPk(user.id); //takes entire row.
        req.user = u;
        next();
    } catch (error) {
        res.status(500).json({
            err: "Something went wrong."
        })
        console.log(error)
    }
}