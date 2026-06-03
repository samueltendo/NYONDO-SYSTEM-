const express = require('express');
const router = express.Router();
const Product = require("../models/stocks");
const Sale = require("../models/sales");
const { ensureAuthenticated, ensureRole } = require("../middleware/auth");


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

        const phone = customerContact?.trim();

        if (!/^(07|03)\d{8}$/.test(phone)) {
            return res.status(400).send(
                "Invalid Ugandan phone number. Use format 0701234567 or 0391234567"
            );
        }
        const { customerName, customerContact, distanceKm, cartData } = req.body;
        const items = JSON.parse(cartData);
        const dist = parseFloat(distanceKm || 0);
        const warnings = [];
        // 1. Calculate TOTAL transport for the whole trip
        const totalTransportFee = dist * 3000; 

        const salePromises = items.map(async (item, index) => {
            const updatedProduct = await Product.findOneAndUpdate(
                { _id: item.productId, quantity: { $gte: item.quantitySold } },
                { $inc: { quantity: -item.quantitySold } },
                { new: true }
            );

            if (!updatedProduct) throw new Error(`Stock low for ${item.itemName}`);

            
            const transportForThisRecord = (index === 0) ? totalTransportFee : 0;

            console.log("req.user =", req.user);

            return Sale.create({
                product: updatedProduct._id,
                itemName: updatedProduct.itemName,
                customerName,
                customerContact,
                quantitySold: item.quantitySold,
                unitPrice: updatedProduct.retailPrice,
                distanceKm: dist,
                transportFee: transportForThisRecord, 
                totalAmount: (item.quantitySold * updatedProduct.retailPrice) + transportForThisRecord,
                branch: req.user.branch || "Entebbe",
                salesAttendant: req.user._id,
                saleDate: new Date()
            });
        });

        const completedSales = await Promise.all(salePromises);
        res.redirect(`/sales/receipt/${completedSales[0]._id}`);
    } catch (err) {
        res.status(500).send(err.message);
    }

});

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
                            transportFee: "$transportFee",
                            amount: "$totalAmount", 
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



   
                                       