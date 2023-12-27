const express = require("express");
const sequelize = require("./connections/database");
const cors = require("cors");
const userRoutes = require("./routes/User");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(userRoutes);

async function main() {
    try {
        let result = await sequelize.sync();
        app.listen(3000);
        console.log("Connection done!");

    } catch (error) {
        console.log(error)
    }
}
main();