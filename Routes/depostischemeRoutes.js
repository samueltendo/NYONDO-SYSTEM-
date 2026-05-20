const express = require('express');
const router = express.Router();
const Deposit = require('../models/deposit');

// GET: Display Ledger
router.get('/', async (req, res) => {
    try {
        const accounts = await Deposit.find().sort({ date: -1 });
        // Ensure filename 'depositScheme' matches your file exactly
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
        if (nin.length !== 14 || phone.length !== 10) {
            const accounts = await Deposit.find();
            return res.render('depositScheme', { 
                accounts, 
                error: "Validation Failed: NIN (14 chars) or Phone (10 digits) incorrect." 
            });
        }

        const newDeposit = new Deposit({
            staffRole,
            customerName,
            phone,
            nin,
            amount: parseFloat(amount),
            date: new Date() // Ensure your schema has a date field
        });

        await newDeposit.save();
        // Redirect back to the main GET route
        res.redirect('/deposits'); 
    } catch (err) {
        res.status(400).send("System Error: " + err.message);
    }
});

module.exports = router;

























// const express = require('express');
// const router = express.Router();
// const Deposit = require('../models/deposit');

// router.get('/', async (req, res) => {
//     try {
//         const accounts = await Deposit.find().sort({ date: -1 });
//         res.render('depositScheme', { title: 'Deposit Scheme', accounts });
//     } catch (err) {
//         res.status(500).send("Error loading deposits");
//     }
// });

// router.post('/add', async (req, res) => {
//     try {
//         const newDeposit = new Deposit(req.body);
//         await newDeposit.save();
//         res.redirect('/depostischeme');
//     } catch (err) {
//         res.render('depostischeme', { error: "Failed to save deposit." });
//     }
// });

// module.exports = router;












// // const express = require('express');
// // const router = require('express').Router();
// // const Deposit = require('../models/deposit');

// // // GET: Display Deposit Ledger
// // router.get('/', async (req, res) => {
// //     try {
// //         const accounts = await Deposit.find().sort({ date: -1 });
// //         res.render('depostischeme', { 
// //             title: 'Deposit Scheme Management',
// //             accounts: accounts 
// //         });
// //     } catch (err) {
// //         res.status(500).send("Ledger Error: " + err.message);
// //     }
// // });

// // // POST: Record New Deposit
// // router.post('/add', async (req, res) => {
// //     try {
// //         const { staffRole, customerName, phone, nin, amount } = req.body;

// //         // Validation for Project Scope (NIN & Phone)
// //         if (nin.length !== 14 || phone.length !== 10) {
// //             const accounts = await Deposit.find();
// //             return res.render('depostischeme', { 
// //                 accounts, 
// //                 error: "Validation Failed: Check NIN (14 chars) or Phone (10 digits)." 
// //             });
// //         }

// //         const newDeposit = new Deposit({
// //             staffRole,
// //             customerName,
// //             phone,
// //             nin,
// //             amount: parseFloat(amount)
// //         });

// //         await newDeposit.save();
// //         res.redirect('/deposits');
// //     } catch (err) {
// //         res.status(400).send("System Error: " + err.message);
// //     }
// // });

// // module.exports = router;