const mongoose = require('mongoose');

const depositSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    phone: { type: String, required: true, minlength: 10, maxlength: 10 },
    nin: { type: String, required: true, minlength: 16, maxlength: 16, uppercase: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('deposit', depositSchema);







