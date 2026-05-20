const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Ensure the path to your model is correct
const Sale = require('../models/sales'); 
const { ensureAuthenticated, ensureRole } = require('../middleware/auth');

// GET: Display Manager Dashboard
router.get('/', ensureAuthenticated, ensureRole('manager'), async (req, res) => {
    try {
        // 1. Fetch all inventory records from MongoDB
        const inventory = await Product.find().sort({ itemName: 1 });

        // 2. Calculate High-Level Stats for the Dashboard Cards
        const totalItems = inventory.length;
        const outOfStock = inventory.filter(item => item.quantity === 0).length;
        
        // DYNAMIC LOGIC: Compare quantity against each item's specific lowStockLevel
        const lowStock = inventory.filter(item => 
            item.quantity > 0 && item.quantity <= item.lowStockLevel
        ).length;

        // 3. Financial Calculation: Total money tied up in stock
        const inventoryValue = inventory.reduce((acc, item) => acc + (item.costPrice * item.quantity), 0);

        // 4. Get the 5 most recently added items for the "Recent Activity" section
        const recentStock = await Product.find().sort({ _id: -1 }).limit(5);

        // 5. Render the Dashboard with all calculated data
        res.render('manager_dashboard', {
            title: 'Store Manager Portal',
            userRole: req.user.role,
            inventory,
            totalItems,
            outOfStock,
            lowStock,
            inventoryValue,
            recentStock,
            user: req.user // Passport provides the logged-in user details
        });

    } catch (err) {
        console.error("Manager Dashboard Error:", err);
        res.status(500).send("Error loading Manager Dashboard: " + err.message);
    }
});

router.get("/TrackStock", ensureAuthenticated, ensureRole('manager'), async (req, res) => {
    try {
        const today = new Date();
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

        // 1. BEST SELLING (Top 5 items by quantity sold in last 30 days)
        const bestSellers = await Sale.aggregate([
            { $match: { saleDate: { $gte: thirtyDaysAgo } } },
            { $group: { _id: "$itemName", totalSold: { $sum: "$quantitySold" } } },
            { $sort: { totalSold: -1 } },
            { $limit: 5 }
        ]);

        // 2. LOW STOCK & EXPIRING SOON
        const allProducts = await Product.find().lean();
        
        const lowStock = allProducts.filter(p => p.quantity <= p.lowStockLevel);
        
        const expiringSoon = allProducts.filter(p => 
            p.expiryDate && (p.expiryDate <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
        );

        // 3. OVERSTAYED (Dead Stock: Items added 90+ days ago with > 80% stock remaining)
        const overstayed = allProducts.filter(p => p.dateAdded <= ninetyDaysAgo && p.quantity > 0);

        res.render("TrackStock", {
            title: "Stock Tracking",
            bestSellers,
            lowStock,
            expiringSoon,
            overstayed
        });
    } catch (err) {
    console.error("TRACK STOCK ERROR:", err);
    res.status(500).send(err.message);
}
});

module.exports = router;