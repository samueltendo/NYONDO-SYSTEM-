const express = require('express');
const router = express.Router();

// Local Inventory (Referenced from your context)
let inventory = [
    { name: 'Deformed Bar 12mm', category: 'Steel', quantity: 50, cost: 45000, retail: 50000 },
    { name: 'Bamburi Cement (50kg)', category: 'Cement', quantity: 120, cost: 32000, retail: 38000 }
];

// GET: Display the Record Sale Form
router.get('/', (req, res) => {
    res.render('record', { 
        title: 'Record New Sale',
        inventory: inventory
    });
});

// POST: Process Sales Record
router.post('/', (req, res) => {
    const { itemName, quantitySold, unitPrice, transportFee } = req.body;
    const qty = parseInt(quantitySold);

    // 1. Check if item exists
    const itemIndex = inventory.findIndex(i => i.name === itemName);
    
    if (itemIndex === -1) {
        return res.status(404).render('record', {
            title: 'Record New Sale',
            inventory: inventory,
            error: "Error: Item not found in inventory."
        });
    }

    const item = inventory[itemIndex];

    // 2. Stock Validation
    if (item.quantity < qty) {
        return res.status(400).render('record', {
            title: 'Record New Sale',
            inventory: inventory,
            error: `Error: Insufficient stock. Only ${item.quantity} units available.`
        });
    }

    // 3. Update Stock Tracking
    inventory[itemIndex].quantity -= qty;

    // 4. Financial Calculations
    const subtotal = qty * parseFloat(unitPrice);
    const total = subtotal + parseFloat(transportFee || 0);

    // Simulated Receipt Console Log
    console.log(`--- NYONDO RECEIPT ---`);
    console.log(`Item: ${itemName} | Qty: ${qty}`);
    console.log(`Total Amount: UGX ${total}`);
    console.log(`Remaining Stock: ${inventory[itemIndex].quantity}`);
    
    res.redirect('/sales?status=success');
});

module.exports = router;