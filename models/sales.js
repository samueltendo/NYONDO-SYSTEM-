const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    itemName: { type: String, required: true },
    customerName: { type: String, required: true },
    customerContact: { type: String, required: true },
    quantitySold: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    distanceKm: { type: Number, default: 0 },
    transportFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    salesAttendant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    branch: { type: String, default: "Entebbe" },
    saleDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Sale", saleSchema);