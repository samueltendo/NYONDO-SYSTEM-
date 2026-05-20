const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Sale = require('../models/sales');
const Deposit = require('../models/deposit');
const Credit = require('../models/Credit'); 
const { ensureAuthenticated, ensureRole } = require('../middleware/auth');

router.get('/', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
    try {
        const stockCount = await Product.countDocuments();
        
        const allSales = await Sale.find();
        const totalSales = allSales.reduce((acc, s) => acc + s.totalAmount, 0);

        const allDeposits = await Deposit.find();
        const totalDeposits = allDeposits.reduce((acc, d) => acc + d.amount, 0);

        const allCredit = await Credit.find();
        const totalDebt = allCredit.reduce((acc, c) => acc + (c.amountOwed || 0), 0);

        const recentSales = await Sale.find().sort({ saleDate: -1 }).limit(5);
        const lowStock = await Product.find({ quantity: { $lt: 10 } }).limit(5);
        
        const notifications = [
            ...recentSales.map(s => ({ staffRole: 'Sales', message: `Sold ${s.itemName}`, time: 'Recent', customer: s.customerName })),
            ...allDeposits.slice(-2).map(d => ({ staffRole: 'Accounts', message: `New Deposit Received`, time: 'Today', customer: d.customerName }))
        ];

        const modules = [
            { name: 'Supplier Credit', desc: 'Track hardware debts', link: '/credit'},
            { name: 'Deposit Scheme', desc: 'Manage customer savings', link: '/deposits' },
            { name: 'Financial Reports', desc: 'P&L and Audit logs', link: '/reports'},
            { name: 'Staff Management', desc: 'User roles & access', link: '/register' },
        ];

        res.render('dashboard', {
            title: 'Admin Command Center',
            user: req.user.fullname,
            userRole: req.user.role,
            stats: {
                stock: stockCount,
                sales: totalSales.toLocaleString(),
                credit: totalDebt.toLocaleString(), 
                deposits: totalDeposits.toLocaleString()
            },
            recentSales,
            lowStock,
            modules,
            notifications
        });
    } catch (err) {
        res.status(500).send("Admin Dashboard Error: " + err.message);
    }
});

module.exports = router;