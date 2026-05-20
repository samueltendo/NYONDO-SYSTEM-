const express = require('express');
const router = express.Router();
const Product = require("../models/stocks");
const Sale = require("../models/sales");
const { ensureAuthenticated, ensureRole } = require("../middleware/auth");

/**
 * @route   GET /sales
 * @desc    Display Sales Point (Inventory list and recent personal sales log)
 */
router.get("/", ensureAuthenticated, ensureRole('attendant'), async (req, res) => {
    try {
        const [inventory, sales] = await Promise.all([
            Product.find({ quantity: { $gt: 0 } }).lean(),
            Sale.find({ salesAttendant: req.user._id })
                .sort({ saleDate: -1 })
                .limit(10)
                .lean()
        ]);

        res.render("sales", {
            title: "Nyondo Sales Point",
            inventory,
            sales,
            user: req.user,
            error: req.query.error
        });
    } catch (err) {
        res.status(500).send("Error loading sales point: " + err.message);
    }
});


router.post("/product", ensureAuthenticated, ensureRole('attendant'), async (req, res) => {
    try {
        const { productId, quantitySold, distanceKm, customerName, customerContact } = req.body;
        const qty = parseInt(quantitySold);

        // 1. Atomic Update: Check stock and decrement in one operation
        // This prevents overselling even without transactions
        const updatedProduct = await Product.findOneAndUpdate(
            { _id: productId, quantity: { $gte: qty } },
            { $inc: { quantity: -qty } },
            { new: true }
        );

        if (!updatedProduct) {
            return res.redirect(`/sales?error=${encodeURIComponent("Insufficient stock or product unavailable.")}`);
        }

        // 2. Automated Financial Calculations
        const dist = parseFloat(distanceKm || 0);
        const transportFee = dist * 3000; 
        const totalAmount = (qty * updatedProduct.retailPrice) + transportFee;

        // 3. Create Sale Record
        const savedSale = await Sale.create({
            product: updatedProduct._id,
            itemName: updatedProduct.itemName,
            customerName,
            customerContact,
            quantitySold: qty,
            unitPrice: updatedProduct.retailPrice,
            distanceKm: dist,
            transportFee,
            totalAmount,
            branch: req.user.branch || "Entebbe",
            salesAttendant: req.user._id,
            saleDate: new Date()
        });

        res.redirect(`/sales/receipt/${savedSale._id}`);

    } catch (err) {
        console.error("Sale Error:", err.message);
        res.redirect(`/sales?error=${encodeURIComponent("An error occurred during processing.")}`);
    }
});

/**
 * @route   GET /sales/receipt/:id
 */
router.get("/receipt/:id", ensureAuthenticated, async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id)
            .populate('salesAttendant', 'fullname')
            .lean();

        if (!sale) return res.status(404).send("Receipt not found.");

        const receiptNo = `NYO-${new Date(sale.saleDate).getFullYear()}-${sale._id.toString().slice(-5).toUpperCase()}`;

        res.render("receipt", {
            title: "Nyondo Hardware Receipt",
            user: req.user,
            sale,
            receiptNo
        });
    } catch (err) {
        res.status(500).send("Error generating receipt.");
    }
});

router.get("/log", ensureAuthenticated, ensureRole('attendant'), async (req, res) => {
    try {
        const dailySummary = await Sale.aggregate([
            { $match: { salesAttendant: req.user._id } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$saleDate" } },
                    totalSalesAmount: { $sum: "$totalAmount" },
                    transactionCount: { $sum: 1 },
                    // This creates an array of all items sold on this date
                    items: { 
                        $push: { 
                            name: "$itemName", 
                            qty: "$quantitySold", 
                            amount: "$totalAmount" 
                        } 
                    }
                }
            },
            { $sort: { "_id": -1 } }
        ]);

        res.render("sales_log", {
            title: "Detailed Sales Log",
            dailySummary: dailySummary || [], 
            user: req.user
        });
    } catch (err) {
        res.status(500).send("Error loading log.");
    }
});

router.get("/stock-log", ensureAuthenticated, ensureRole('attendant'), async (req, res) => {
    try {
        const products = await Product.find().sort({ itemName: 1 }).lean();
        
        // Define the "Recent" window (items updated in the last 72 hours)
        const recentThreshold = new Date(Date.now() - 72 * 60 * 60 * 1000);

        const stockLog = products.map(item => {
            const isNew = item.createdAt > recentThreshold;
            const isPriceChanged = item.lastPriceUpdate > recentThreshold;
            const isRestocked = item.lastStocked > recentThreshold && !isNew;
            const isLow = item.quantity <= (item.lowStockLevel || 5);

            return {
                ...item,
                status: isLow ? 'LOW' : (item.quantity === 0 ? 'OUT' : 'OK'),
                flags: { isNew, isPriceChanged, isRestocked, isLow }
            };
        });

        res.render("stock_log", {
            title: "Hardware Stock Log",
            inventory: stockLog,
            user: req.user
        });
    } catch (err) {
        console.error("Stock Log Error:", err);
        res.status(500).send("Internal Server Error: Unable to fetch stock log.");
    }
});
module.exports = router;