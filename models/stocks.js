const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    itemName: { type: String, required: true, trim: true },
    category: { 
        type: String, 
        required: true, 
        enum: ['Steel', 'Cement', 'Roofing', 'Plumbing', 'Other'] 
    },
    quantity: { type: Number, required: true, min: 0 },
    costPrice: { type: Number, required: true },
    retailPrice: { type: Number, required: true },
    lowStockLevel: { type: Number, default: 10 },
    lastUpdated: { type: Date, default: Date.now },
    lastStocked: { type: Date, default: Date.now },
    lastPriceUpdate: { type: Date, default: Date.now },
    expiryDate: { type: Date },       // For perishable items like paint/cement
    dateAdded: { type: Date, default: Date.now }
});


// Automated Price Integrity Check
productSchema.pre('save', function(next) {
    if (this.retailPrice <= this.costPrice) {
        return next(new Error('Retail price must be greater than cost price.'));
    }
    this.lastUpdated = Date.now();
    next();
});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);