const express = require('express');
const router = express.Router();

// Simulated Database (In a real app, fetch from SQLite)
let inventory = [
    { id: 1, name: 'Deformed Bar 12mm', quantity: 50, price: 50000 },
    { id: 2, name: 'Bamburi Cement (50kg)', quantity: 120, price: 38000 }
];

let salesLog = [];

// GET: Display Sales Dashboard
router.get('/', (req, res) => {
    res.render('sales', { 
        title: 'Sales Management',
        inventory: inventory,
        sales: salesLog
    });
});

// POST: Process Sale (Calculates Transport & Updates Stock)
router.post('/record', (req, res) => {
    const { productId, quantitySold, distanceKm } = req.body;
    
    const item = inventory.find(i => i.id == productId);
    const qty = parseInt(quantitySold);
    const dist = parseFloat(distanceKm || 0);

    // 1. Validation
    if (!item || item.quantity < qty) {
        return res.render('sales', {
            title: 'Sales Management',
            inventory: inventory,
            sales: salesLog,
            error: "Error: Insufficient stock available."
        });
    }

    // 2. Transport Automation (3,000 UGX per KM)
    const transportFee = dist * 3000;
    const subtotal = item.price * qty;
    const totalAmount = subtotal + transportFee;

    // 3. Update Stock
    item.quantity -= qty;

    // 4. Save to Log
    salesLog.unshift({
        itemName: item.name,
        qty: qty,
        total: totalAmount,
        transport: transportFee,
        date: new Date().toLocaleString()
    });

    res.redirect('/sales?success=true');
});

module.exports = router;