const User = require("../models/User");

exports.getLeaderBoard = async (req, res) => {
    try {
        let user = await User.findAll({
            attributes: ["id", "username", "totalExpenses"],
            group: ["id"],
            order: [["totalExpenses", "DESC"]]
        });
        res.status("200").json({
            user
        })
    } catch (error) {
        console.log(error);
    }
}