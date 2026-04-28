const express = require('express');
const router = express.Router();
const Product = require('../models/stocks');

// GET: Display Stock
router.get('/', async (req, res) => {
    const inventory = await Product.find().sort({ itemName: 1 });
    res.render('stock', { title: 'Inventory Management', inventory });
});

// POST: Register New Stock (Manager Role)
router.post('/add', async (req, res) => {
    try {
        const { itemName, category, quantity, costPrice, retailPrice } = req.body;

        // Requirement #6: Price Validation
        if (parseFloat(retailPrice) <= parseFloat(costPrice)) {
            const inventory = await Product.find().sort({ itemName: 1 });
            return res.status(400).render('stock', {
                inventory,
                error: "Validation Error: Selling price must exceed cost price."
            });
        }

        const newProduct = new Product({
            itemName, category, 
            quantity: parseInt(quantity), 
            costPrice: parseFloat(costPrice), 
            retailPrice: parseFloat(retailPrice)
        });
        await newProduct.save();
        res.redirect('/stock');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// POST: Record Sale (Sales Attendant Role)
router.post('/record', async (req, res) => {
    try {
        const { productId, quantitySold, distanceKm } = req.body;
        const qty = parseInt(quantitySold);
        
        const item = await Product.findById(productId);
        if (!item) return res.status(404).send("Item not found");

        // Requirement Check: Stock availability
        if (item.quantity < qty) return res.status(400).send("Insufficient stock.");

        // Requirement #5: Automated Transport (3000 UGX per KM)
        const transportFee = parseFloat(distanceKm || 0) * 3000;
        const total = (item.retailPrice * qty) + transportFee;

        // Stock Tracking: Reduce quantity
        item.quantity -= qty;
        await item.save();

        res.redirect('/sales?status=success');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;