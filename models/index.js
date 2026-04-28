const mongoose = require('mongoose');

// 1. USER SCHEMA
const UserSchema = new mongoose.Schema({
    fullname: String,
    phone: { type: String, minlength: 10, maxlength: 10 },
    nin: { type: String, minlength: 14, maxlength: 14, unique: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'manager', 'attendant'] }
});

// 2. PRODUCT SCHEMA
const ProductSchema = new mongoose.Schema({
    itemName: String,
    category: { type: String, enum: ['Steel', 'Cement', 'Roofing', 'Other'] },
    quantity: { type: Number, default: 0 },
    costPrice: Number,
    retailPrice: Number
});

// 3. SALE SCHEMA
const SaleSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    itemName: String,
    quantitySold: Number,
    transportFee: { type: Number, default: 0 },
    totalAmount: Number,
    salesAttendant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    saleDate: { type: Date, default: Date.now }
});

// 4. CREDIT SCHEMA
const CreditSchema = new mongoose.Schema({
    supplierName: String,
    amountOwed: Number,
    dueDate: Date,
    status: { type: String, default: 'Pending' }
});

// 5. DEPOSIT SCHEMA
const DepositSchema = new mongoose.Schema({
    customerName: String,
    phone: String,
    nin: String,
    amount: Number,
    staffRole: String 
});

module.exports = {
    User: mongoose.model('User', UserSchema),
    Product: mongoose.model('Product', ProductSchema),
    Sale: mongoose.model('Sale', SaleSchema),
    Credit: mongoose.model('Credit', CreditSchema),
    Deposit: mongoose.model('Deposit', DepositSchema)
};