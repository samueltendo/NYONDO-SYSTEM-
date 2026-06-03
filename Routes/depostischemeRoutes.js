const express = require('express');
const router = express.Router();
const Deposit = require('../models/deposit');

// GET: Display Ledger
router.get('/', async (req, res) => {
    try {
        const accounts = await Deposit.find().sort({ date: -1 });
        res.render('depositScheme', { 
            title: 'Deposit Scheme Management',
            accounts: accounts 
        });
    } catch (err) {
        res.status(500).send("Error loading deposits");
    }
});

// POST: Record New Deposit
router.post('/add', async (req, res) => {
    try {
        const { staffRole, customerName, phone, nin, amount } = req.body;

        // Validation
        if (nin.length !== 16 || phone.length !== 10) {
            const accounts = await Deposit.find();
            return res.render('depositScheme', { 
                accounts, 
                error: "Validation Failed: NIN (16 characters) or Phone (10 digits) incorrect." 
            });
        }

        const newDeposit = new Deposit({
            staffRole,
            customerName,
            phone,
            nin,
            amount: parseFloat(amount),
            date: new Date() 
        });

        await newDeposit.save();
        // Redirect back to the main GET route
        res.redirect('/deposits'); 
    } catch (err) {
        res.status(400).send("System Error: " + err.message);
    }
});

module.exports = router;
































