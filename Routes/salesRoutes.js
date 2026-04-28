const express = require('express');
const router = express.Router();
const Product = require('../models/stocks');
const Sale = require('../models/Sales');

// GET: Display the Record Sale Form
router.get('/record', async (req, res) => {
    try {
        const inventory = await Product.find({ quantity: { $gt: 0 } });
        res.render('record', { title: 'Record Transaction', inventory });
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});

// POST: Process the Sale
router.post('/record', async (req, res) => {
    try {
        const { productId, quantitySold, unitPrice, transportFee } = req.body;
        const qty = parseInt(quantitySold);
        const transFee = parseFloat(transportFee || 0);

        // 1. Find Product
        const item = await Product.findById(productId);
        if (!item || item.quantity < qty) {
            const inventory = await Product.find();
            return res.render('record', { 
                title: 'Record Transaction', 
                inventory, 
                error: "Insufficient stock or item not found." 
            });
        }

        // 2. Financials
        const subtotal = qty * parseFloat(unitPrice);
        const total = subtotal + transFee;

        // 3. Update Inventory & Save Sale
        item.quantity -= qty;
        await item.save();

        await Sale.create({
            product: item._id,
            itemName: item.itemName,
            quantitySold: qty,
            unitPrice: parseFloat(unitPrice),
            transportFee: transFee,
            totalAmount: total,
            salesAttendant: req.session.user ? req.session.user.id : null,
            saleDate: new Date()
        });

        res.redirect('/sales?status=success');
    } catch (err) {
        res.status(500).send("Transaction Error: " + err.message);
    }
});

module.exports = router;