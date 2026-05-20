const express = require('express');
const router = express.Router();

// 1. IMPORT MODELS 
const Sale = require('../models/sales'); 
const Product = require('../models/Product');
const { ensureAuthenticated, ensureRole } = require('../middleware/auth');

// 2. ADMIN-ONLY ROUTE
router.get('/', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
    try {
        // Fetch all sales and inventory records
        const sales = await Sale.find().sort({ saleDate: -1 });
        const inventory = await Product.find().sort({ itemName: 1 });

        // 3. CALCULATE FINANCIAL STATS
        // Total money collected from all sales
        const totalRevenue = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
        
        // Total value of current inventory (Qty * Cost Price)
        const totalStockValue = inventory.reduce((sum, p) => sum + (p.quantity * p.costPrice), 0);
        
        // Total count of items in the building
        const totalItemsCount = inventory.reduce((sum, p) => sum + p.quantity, 0);

        // 4. RENDER
        res.render('reports', {
            title: 'Nyondo Hardware Admin Reports',
            stats: {
                revenue: totalRevenue.toLocaleString(),
                stockValue: totalStockValue.toLocaleString(),
                itemCount: totalItemsCount
            },
            sales,
            inventory
        });
    } catch (err) {
        console.error("Report Error:", err);
        res.status(500).send("Report Generation Error: " + err.message);
    }
});

module.exports = router;