const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  itemName: String, // Snapshot of item name for reports
  quantitySold: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  distanceKm: { type: Number, default: 0 },
  transportFee: { type: Number, default: 0 }, // Distance * 3000
  totalAmount: { type: Number, required: true },
  salesAttendant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  branch: { type: String, default: "Entebbe" },
  saleDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Sale", saleSchema);
