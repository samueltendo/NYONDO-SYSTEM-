const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Ensure the path to your model is correct
const Sale = require('../models/sales'); 
const { ensureAuthenticated, ensureRole } = require('../middleware/auth');

router.get('/', ensureAuthenticated, ensureRole('manager'), async (req, res) => {
    try {
        const inventory = await Product.find().sort({ itemName: 1 });
        
        // --- FOR RECENT RESTOCKS ---
        const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
        
        // Find items restocked in the last 48 hours
        const recentlyRestocked = inventory.filter(item => 
            item.lastStocked && item.lastStocked > fortyEightHoursAgo
        );

        // ... existing stats calculation ...
        const totalItems = inventory.length;
        const outOfStock = inventory.filter(item => item.quantity === 0).length;
        const lowStock = inventory.filter(item => item.quantity > 0 && item.quantity <= item.lowStockLevel).length;
        const inventoryValue = inventory.reduce((acc, item) => acc + (item.costPrice * item.quantity), 0);

        res.render('manager_dashboard', {
            title: 'Store Manager Portal',
            inventory,
            recentlyRestocked, 
            totalItems,
            outOfStock,
            lowStock,
            inventoryValue,
            user: req.user
        });
    } catch (err) {
        res.status(500).send("Error loading dashboard: " + err.message);
    }
});

router.get("/TrackStock", ensureAuthenticated, ensureRole('manager'), async (req, res) => {
    try {
        const now = new Date();
        const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const allProducts = await Product.find().lean();

        // 1. BEST SELLING
        const bestSellers = await Sale.aggregate([
            { $match: { saleDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
            { $group: { _id: "$itemName", totalSold: { $sum: "$quantitySold" } } },
            { $sort: { totalSold: -1 } },
            { $limit: 5 }
        ]);

        // RECENTLY ADDED ( new stock)
        const recentlyAdded = allProducts.filter(p => p.dateAdded >= sevenDaysAgo);

        //  LOW STOCK
        const lowStock = allProducts.filter(p => p.quantity <= (p.lowStockLevel || 5));

        // EXPIRING SOON (Between now and 30 days)
        const expiringSoon = allProducts.filter(p => 
            p.expiryDate && new Date(p.expiryDate) <= thirtyDaysFromNow && new Date(p.expiryDate) >= now
        );

        //  OVERSTAYED (90+ days old)
        const overstayed = allProducts.filter(p => new Date(p.dateAdded) <= ninetyDaysAgo);

        res.render("TrackStock", {
            title: "Stock Tracking",
            bestSellers,
            recentlyAdded, 
            lowStock,
            expiringSoon,
            overstayed,
            user: req.user
        });
    } catch (err) {
        console.error("TRACK STOCK ERROR:", err);
        res.status(500).send(err.message);
    }
});
module.exports = router;