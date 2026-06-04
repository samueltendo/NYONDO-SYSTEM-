const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    itemName: String,
    category: { type: String, enum: ['Steel', 'Cement', 'Roofing', 'Water Systems', 'PVC', 'Construction', 'Safety', 'Paints', 'Plumbing', 'Electrical', 'Tiles', 'Timber', 'Tools', 'Nails'] },
    unit: String, 
    productImage: { type: String, default: null },
    quantity: { type: Number, default: 0 },
    costPrice: Number,
    retailPrice: Number,
    lowStockLevel: { type: Number, default: 5 },
    dateAdded: { type: Date, default: Date.now },
    expiryDate: Date,
    lastStocked: Date,
    lastPriceUpdate: Date,
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Product', ProductSchema);
