const mongoose = require("mongoose");
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE);
        console.log("mongodb has successfully connected");
    } catch (error) {
        console.log(`connection error: ${error.message}`);
        process.exit(1);
    }
};
module.exports = connectDB;