const express = require('express');
const router = require('express').Router();
const Deposit = require('../models/Deposit');

// GET: Display Deposit Ledger
router.get('/', async (req, res) => {
    try {
        const accounts = await Deposit.find().sort({ date: -1 });
        res.render('depostischeme', { 
            title: 'Deposit Scheme Management',
            accounts: accounts 
        });
    } catch (err) {
        res.status(500).send("Ledger Error: " + err.message);
    }
});

// POST: Record New Deposit
router.post('/add', async (req, res) => {
    try {
        const { staffRole, customerName, phone, nin, amount } = req.body;

        // Validation for Project Scope (NIN & Phone)
        if (nin.length !== 14 || phone.length !== 10) {
            const accounts = await Deposit.find();
            return res.render('depostischeme', { 
                accounts, 
                error: "Validation Failed: Check NIN (14 chars) or Phone (10 digits)." 
            });
        }

        const newDeposit = new Deposit({
            staffRole,
            customerName,
            phone,
            nin,
            amount: parseFloat(amount)
        });

        await newDeposit.save();
        res.redirect('/deposits');
    } catch (err) {
        res.status(400).send("System Error: " + err.message);
    }
});

module.exports = router;