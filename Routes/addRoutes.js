const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Import your MongoDB Schema

// GET: Display the Stock Page
router.get('/', async (req, res) => {
    try {
        // Fetch real data from MongoDB
        const inventory = await Product.find().sort({ itemName: 1 });
        res.render('add', { 
            title: 'Inventory Management',
            inventory: inventory
        });
    } catch (err) {
        res.status(500).send("Database Error: " + err.message);
    }
});

// POST: Process New Stock Registration (Store Manager Role)
router.post('/add', async (req, res) => {
    try {
        const { itemName, category, quantity, costPrice, retailPrice } = req.body;

        // Validation: Selling price must be greater than cost
        if (parseFloat(retailPrice) <= parseFloat(costPrice)) {
            const inventory = await Product.find().sort({ itemName: 1 });
            return res.status(400).render('add', {
                title: 'Inventory Management',
                inventory: inventory,
                error: "Validation Error: Selling price must be greater than cost price."
            });
        }

        // Save to MongoDB
        const newProduct = new Product({
            itemName,
            category,
            quantity: parseInt(quantity),
            costPrice: parseFloat(costPrice),
            retailPrice: parseFloat(retailPrice)
        });

        await newProduct.save();
        res.redirect('/stock');
    } catch (err) {
        const inventory = await Product.find().sort({ itemName: 1 });
        res.status(400).render('add', {
            title: 'Inventory Management',
            inventory: inventory,
            error: "Registration Error: " + err.message
        });
    }
});

module.exports = router;