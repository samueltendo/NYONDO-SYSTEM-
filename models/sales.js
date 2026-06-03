const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  itemName: { type: String, required: true },
  customerName: { type: String, required: true },
  customerContact: { type: String, required: true, match: [/^\d{10}$/, "Please enter a valid 10-digit Ugandan phone number"] },
  quantitySold: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  distanceKm: { type: Number, default: 0 },
  transportFee: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  salesAttendant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  branch: { type: String, default: "Entebbe" },
  saleDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Sale", saleSchema);
