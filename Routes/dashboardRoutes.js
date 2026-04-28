const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // 1. Session Security
    if (!req.session.user) return res.redirect('/auth/login');
    const user = req.session.user;

    // 2. Notifications from global store
    const alerts = global.notifications || [];

    // 3. System Stats (Placeholders aligned with Hardware Scope)
    const stats = {
        stock: 145,
        sales: "1,250,000",
        debt: "8,700,000"
    };

    // 4. Module List with Role Logic
    const allModules = [
        { name: 'Stock Management', desc: 'Real-time inventory tracking', link: '/stock', roles: ['admin', 'manager'] },
        { name: 'Sales Tracking', desc: 'History and automated receipts', link: '/sales', roles: ['admin', 'manager', 'attendant'] },
        { name: 'Deposit Scheme', desc: 'Customer savings and deposits', link: '/deposits', roles: ['admin', 'manager', 'attendant'] },
        { name: 'Credit Management', desc: 'Supplier debt tracking', link: '/credit', roles: ['admin', 'manager'] },
        { name: 'Financial Reports', desc: 'Profit & Loss analytics', link: '/reports', roles: ['admin', 'manager'] },
        { name: 'Staff Management', desc: 'User roles and registration', link: '/register/register', roles: ['admin'] }
    ];

    // Filter modules based on logged-in user role
    const filteredModules = allModules.filter(mod => mod.roles.includes(user.role));

    res.render('dashboard', { 
        title: 'NyondoStock Dashboard',
        user: user.name,
        userRole: user.role,
        stats: stats,
        modules: filteredModules,
        notifications: alerts 
    });
});

module.exports = router;