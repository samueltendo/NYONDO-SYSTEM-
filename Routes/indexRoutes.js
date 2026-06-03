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





module.exports = router;