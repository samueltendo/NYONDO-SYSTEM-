const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    itemName: { type: String, required: true, trim: true },
    category: { 
        type: String, 
        required: true, 
        enum: ['Steel', 'Cement', 'Roofing', 'Plumbing'] 
    },
    quantity: { type: Number, required: true, min: 0 },
    costPrice: { type: Number, required: true },
    retailPrice: { type: Number, required: true },
    lowStockLevel: { type: Number, default: 10 },
    lastUpdated: { type: Date, default: Date.now }
});

// Middleware to ensure retail price > cost price before saving
productSchema.pre('save', function(next) {
    if (this.retailPrice <= this.costPrice) {
        return next(new Error('Retail price must be greater than cost price.'));
    }
    next();
});

// UPDATED EXPORT: Prevents "Cannot overwrite model once compiled" error
module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);