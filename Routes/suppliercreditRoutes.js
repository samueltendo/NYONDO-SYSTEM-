const express = require('express');
const router = express.Router();
const Credit = require('../models/Credit');
const { ensureAuthenticated, ensureRole } = require('../middleware/auth');

// GET: Display Credit Management Page
router.get('/', ensureAuthenticated, ensureRole('Admin'), async (req, res) => {
    try {
        const credits = await Credit.find().sort({ dueDate: 1 });
        
        // Calculate total debt for the dashboard card
        const totalPending = credits
            .filter(c => c.status === 'Pending')
            .reduce((acc, curr) => acc + curr.amountOwed, 0);

        res.render('supplierCredit', {
            title: 'Supplier Credit Tracking',
            credits: credits,
            totalPending: totalPending.toLocaleString()
        });
    } catch (err) {
        res.status(500).send("Database Error: " + err.message);
    }
});

// POST: Record New Supplier Credit
router.post('/add', ensureAuthenticated, ensureRole('Admin'), async (req, res) => {
    try {
        const { supplierName, item, amountOwed, dueDate , quantity, unit } = req.body;

        const newCredit = new Credit({
            supplierName,
            item,
            quantity,
            unit,
            amountOwed: parseFloat(amountOwed),
            dueDate
        });

        await newCredit.save();
        res.redirect('/credit');
    } catch (err) {
        console.error("Error saving credit:", err);
        const credits = await Credit.find();
        res.render('supplierCredit', { 
            credits, 
            error: "Failed to save: " + err.message 
        });
    }
});

// POST: Mark Credit as Paid
router.post('/pay/:id', ensureAuthenticated, ensureRole('Admin'), async (req, res) => {
    try {
        await Credit.findByIdAndUpdate(req.params.id, { status: "Paid" });
        res.redirect('/credit');
    } catch (err) {
        res.status(500).send("Update Error");
    }
});

module.exports = router;













// const express = require('express');
// const router = express.Router();
// const Credit = require('../models/Credit');

// // GET: Display Credit Management Page
// router.get('/', async (req, res) => {
//     try {
//         // Fetch real data from MongoDB
//         const credits = await Credit.find().sort({ dueDate: 1 });
//         res.render('supplierCredit', {
//             title: 'Supplier Credit Tracking',
//             credits: credits
//         });
//     } catch (err) {
//         res.status(500).send("Database Error: " + err.message);
//     }
// });

// // POST: Record New Supplier Credit
// router.post('/add', async (req, res) => {
//     try {
//         const { supplierName, item, amountOwed, dueDate } = req.body;

//         // Validation
//         if (!supplierName || !amountOwed || !dueDate) {
//             const credits = await Credit.find();
//             return res.render('supplierCredit', {
//                 credits,
//                 error: "Please fill in all required fields."
//             });
//         }

//         // Save to MongoDB
//         const newCredit = new Credit({
//             supplierName,
//             item,
//             amountOwed: parseFloat(amountOwed),
//             dueDate
//         });

//         await newCredit.save();
//         res.redirect('/credit');
//     } catch (err) {
//         res.status(400).send("Registration Error: " + err.message);
//     }
// });

// // POST: Mark Credit as Paid
// router.post('/pay/:id', async (req, res) => {
//     try {
//         // Update the status in the Database
//         await Credit.findByIdAndUpdate(req.params.id, { status: "Paid" });
//         res.redirect('/credit');
//     } catch (err) {
//         res.status(500).send("Update Error: " + err.message);
//     }
// });

// module.exports = router;