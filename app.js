const env = require("dotenv");
env.config();
const express = require("express");
const sequelize = require("./connections/database");
const cors = require("cors");
const morgan = require("morgan")
const userRoutes = require("./routes/User");
const expenseRoutes = require("./routes/Expenses");
const path = require("path");
const fs = require("fs");
const User = require('./models/User');
const Expense = require('./models/Expenses');
const Order = require("./models/Order");
const purchaseRoutes = require("./routes/Purchase");
const premiumRoutes = require("./routes/Premium");
const resetPasswordRoutes = require("./routes/ResetPassword");
const ResetPassword = require("./models/ResetPassword");
const Download = require("./models/Downloadfiles")


const app = express();
const accesslogstream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" });

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("combined", { stream: accesslogstream }))
app.use(express.static("public"));
app.use(userRoutes);
app.use(expenseRoutes);
app.use(purchaseRoutes);
app.use(premiumRoutes);
app.use(resetPasswordRoutes);
app.use("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', `signup.html`));
})

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ResetPassword);
ResetPassword.belongsTo(User);

User.hasMany(Download);
Download.hasOne(User);

async function main() {
    try {
        await sequelize.sync();
        app.listen(process.env.PORT || 3000);
        console.log("Connection done!");
    } catch (error) {
        console.log(error)
    }
}
main();