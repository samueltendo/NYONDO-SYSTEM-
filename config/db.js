const mongoose = require("mongoose");
const connectDB = async () => {
    try {
        const {connection} = await mongoose.connect(process.env.DATABASE);

        if (connection.readyState !== 1) {
            throw new Error("Mongoose did not reach connected state");
        }
        console.log(`Mongoose connected: ${connection.host}:${connection.port}`);
         return connection;
        // console.log("mongodb has successfully connected");
    } catch (error) {
        console.log(`connection error: ${error.message}`);
        process.exit(1);
    }
};
module.exports = connectDB;