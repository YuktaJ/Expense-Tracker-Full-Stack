const express = require("express");
const sequelize = require("./connections/database");
const cors = require("cors");
const userRoutes = require("./routes/User");
const expenseRoutes = require("./routes/Expenses");
const User = require('./models/User');
const Expense = require('./models/Expenses');
const Order = require("./models/Order");
const purchaseRoutes = require("./routes/Purchase");
const premiumRoutes = require("./routes/Premium");
const resetPasswordRoutes = require("./routes/ResetPassword");
const ResetPassword = require("./models/ResetPassword");
const env = require("dotenv");

const app = express();

env.config();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(userRoutes);
app.use(expenseRoutes);
app.use(purchaseRoutes);
app.use(premiumRoutes);
app.use(resetPasswordRoutes);


User.hasMany(Expense);
Expense.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(User);
User.hasMany(ResetPassword);
ResetPassword.belongsTo(User);

async function main() {
    try {
        await sequelize.sync();
        app.listen(3000);
        console.log("Connection done!");
    } catch (error) {
        console.log(error)
    }
}
main();