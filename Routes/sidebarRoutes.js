const express = require('express');
const router = express.Router();

// Middleware: Injects sidebar navigation data into every request
router.use((req, res, next) => {
    res.locals.navItems = [
        { label: 'Dashboard', icon: '📊', path: '/dashboard' },
        { label: 'Sales Management', icon: '🛒', path: '/sales' },
        { label: 'Stock & Inventory', icon: '📦', path: '/stock' },
        { label: 'Team Members', icon: '👥', path: '/users/register' },
        { label: 'Reports', icon: '📈', path: '/reports' }
    ];
    res.locals.currentPath = req.path;
    next();
});

// Sidebar Navigation Logic
router.get('/dashboard', (req, res) => {
    res.render('dashboard', { title: 'Dashboard' });
});

router.get('/sales', (req, res) => {
    res.render('sales', { title: 'Sales Management' });
});

router.get('/stock', (req, res) => {
    res.render('add', { title: 'Stock & Inventory' });
});

router.get('/users/register', (req, res) => {
    res.render('register', { title: 'Staff Registration' });
});

router.get('/reports', (req, res) => {
    res.render('reports', { title: 'System Reports' });
});

module.exports = router;