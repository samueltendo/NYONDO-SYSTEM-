const express = require('express');
const router = express.Router();
const Sale = require('../models/sales');
const Product = require('../models/Product');
const { ensureAuthenticated, ensureRole } = require('../middleware/auth');



router.get('/', ensureAuthenticated, ensureRole('attendant'), async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. Fetch Today's Personal Sales
        const todaySales = await Sale.find({
            salesAttendant: req.user._id,
            saleDate: { $gte: today }
        }).sort({ saleDate: -1 });

        // 2. Calculate Today's Total Cash Collected
        const totalCash = todaySales.reduce((acc, sale) => acc + sale.totalAmount, 0);

        // 3. Check for Low Stock (less than 10 units)
        const lowStockItems = await Product.find({ quantity: { $lt: 10 } });

        // 4. Get New Stock (Recently added 5 items)
        const newStock = await Product.find().sort({ _id: -1 }).limit(5);

        res.render('sales_dashboard', {
            title: 'Attendant Desk',
           userRole: req.user.role,
            todaySales,
            totalCash,
            lowStockItems,
            newStock,
            user: req.user
        });
    } catch (err) {
        res.status(500).send("Error loading dashboard");
    }
});

module.exports = router;




