const express = require('express');
const router = express.Router();
// TODO:const Sale = require('../models/sales');
const Product = require('../models/stocks');

router.get('/', async (req, res) => {
    try {
        const sales = await Sale.find().sort({ saleDate: -1 }).populate('salesAttendant');
        const inventory = await Product.find().sort({ itemName: 1 });

        // Calculate Stats for Managers
        const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
        const totalStockValue = inventory.reduce((sum, p) => sum + (p.quantity * p.costPrice), 0);
        const totalItemsCount = inventory.reduce((sum, p) => sum + p.quantity, 0);

        res.render('reports', {
            title: 'Nyondo Reports',
            stats: {
                revenue: totalRevenue,
                stockValue: totalStockValue,
                itemCount: totalItemsCount
            },
            sales,
            inventory
        });
    } catch (err) {
        res.status(500).send("Report Generation Error: " + err.message);
    }
});

module.exports = router;