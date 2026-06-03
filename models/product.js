const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    itemName: String,
    category: { type: String, enum: ['Steel', 'Cement', 'Roofing', 'Other'] },
    productImage: { type: String, default: null },
    quantity: { type: Number, default: 0 },
    costPrice: Number,
    retailPrice: Number,
    lowStockLevel: { type: Number,  },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Product', ProductSchema);