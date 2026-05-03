const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    phone: { type: String, required: true, minlength: 10, maxlength: 10 },
    nin: { type: String, required: true, unique: true, minlength: 14, maxlength: 14 },
    role: { 
        type: String, 
        required: true, 
        enum: ['manager', 'attendant', 'admin'] 
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);