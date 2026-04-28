const mongoose = require('mongoose');

const depositSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    phone: { type: String, required: true, minlength: 10, maxlength: 10 },
    nin: { type: String, required: true, minlength: 14, maxlength: 14 },
    amount: { type: Number, required: true },
    staffRole: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Deposit', depositSchema);