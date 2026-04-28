const mongoose = require('mongoose');

const creditSchema = new mongoose.Schema({
    supplierName: { type: String, required: true },
    item: { type: String, required: true },
    amountOwed: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Credit', creditSchema);