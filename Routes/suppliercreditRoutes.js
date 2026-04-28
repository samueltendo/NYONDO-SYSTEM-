const express = require('express');
const router = express.Router();
const Credit = require('../models/Credit');

// GET: Display Credit Management Page
router.get('/', async (req, res) => {
    try {
        // Fetch real data from MongoDB
        const credits = await Credit.find().sort({ dueDate: 1 });
        res.render('supplierCredit', {
            title: 'Supplier Credit Tracking',
            credits: credits
        });
    } catch (err) {
        res.status(500).send("Database Error: " + err.message);
    }
});

// POST: Record New Supplier Credit
router.post('/add', async (req, res) => {
    try {
        const { supplierName, item, amountOwed, dueDate } = req.body;

        // Validation
        if (!supplierName || !amountOwed || !dueDate) {
            const credits = await Credit.find();
            return res.render('supplierCredit', {
                credits,
                error: "Please fill in all required fields."
            });
        }

        // Save to MongoDB
        const newCredit = new Credit({
            supplierName,
            item,
            amountOwed: parseFloat(amountOwed),
            dueDate
        });

        await newCredit.save();
        res.redirect('/credit');
    } catch (err) {
        res.status(400).send("Registration Error: " + err.message);
    }
});

// POST: Mark Credit as Paid
router.post('/pay/:id', async (req, res) => {
    try {
        // Update the status in the Database
        await Credit.findByIdAndUpdate(req.params.id, { status: "Paid" });
        res.redirect('/credit');
    } catch (err) {
        res.status(500).send("Update Error: " + err.message);
    }
});

module.exports = router;