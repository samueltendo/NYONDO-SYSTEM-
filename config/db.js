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

module.exports = connectDB;