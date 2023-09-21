require("dotenv").config();

const mongoose = require("mongoose");


async function connection() {

    try {
        await mongoose.connect(process.env.Db_URL);
        console.log("connected to database");

    } catch (err) {
        console.log("mali");
    }
}

module.exports = connection;