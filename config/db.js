<<<<<<< HEAD
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE);
        console.log(`MongoDB Connected`);
    } catch (error) {
        console.log(` Connection error: ${error.message}`);
        process.exit(1); // Stop system if DB fails
    }
};

=======
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
>>>>>>> c3721b14a3c45d865b28048217d21b2c8937a7f1
module.exports = connectDB;