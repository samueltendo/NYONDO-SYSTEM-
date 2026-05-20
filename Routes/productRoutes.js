const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const { ensureAuthenticated, ensureRole } = require('../middleware/auth');

// --- SECURE MULTER CONFIGURATION ---
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, `prod-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB Limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) return cb(null, true);
        cb(new Error("Only Images (jpeg/jpg/png/webp) are allowed!"));
    }
});


router.get('/', ensureAuthenticated, ensureRole('manager'), async (req, res) => {
    try {
        const products = await Product.find().sort({ itemName: 1 }).lean();
        res.render('product', { 
            title: 'Inventory | Nyondo Hardware',
            products,
            success: req.query.status === 'success',
            updated: req.query.status === 'updated',
            error: req.query.error
        });
    } catch (err) {
        res.status(500).render('error', { message: "Could not load products." });
    }
});


router.post('/product', ensureAuthenticated, ensureRole('manager'), upload.single('productImage'), async (req, res) => {
    try {
        const { itemName, category, quantity, costPrice, retailPrice, lowStockLevel } = req.body;

        // Profitability Logic Check
        if (parseFloat(costPrice) >= parseFloat(retailPrice)) {
            return res.redirect(`/products?error=${encodeURIComponent("Cost price must be lower than retail price.")}`);
        }

        const newProduct = new Product({
            itemName,
            category,
            quantity: parseInt(quantity),
            costPrice: parseFloat(costPrice),
            retailPrice: parseFloat(retailPrice),
            lowStockLevel: parseInt(lowStockLevel || 5),
            productImage: req.file ? req.file.filename : 'no-image.jpg'
        });

        await newProduct.save();
        res.redirect('/products?status=success');

    } catch (err) {
        console.error("Add Product Error:", err);
        res.redirect(`/products?error=${encodeURIComponent(err.message)}`);
    }
});

router.get('/edit/:id', ensureAuthenticated, ensureRole('manager'), async (req, res) => {
    try {
        const item = await Product.findById(req.params.id).lean();
        if (!item) return res.status(404).send("Product not found");

        res.render('edit_price', { 
            title: 'Update Product Details', 
            item 
        });
    } catch (err) {
    console.error("EDIT PRODUCT ERROR:", err);
    res.status(500).send(err.message);
}
});

router.post('/edit/:id', ensureAuthenticated, ensureRole('manager'), upload.single('productImage'), async (req, res) => {
    try {
        const { costPrice, retailPrice } = req.body;
        const updateData = { ...req.body };

        // Validation: Prevent loss-making updates
        if (parseFloat(costPrice) >= parseFloat(retailPrice)) {
            return res.redirect(`/products/edit/${req.params.id}?error=PriceMismatch`);
        }
        
        // Handle image update if new file is uploaded
        if (req.file) {
            updateData.productImage = req.file.filename;
        }

        await Product.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/products?status=updated');

    } catch (err) {
    console.error("EDIT PRODUCT ERROR:", err);
    res.status(500).send(err.message);
}
});


router.post('/delete/:id', ensureAuthenticated, ensureRole('manager'), async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/products?status=deleted');
    } catch (err) {
        res.redirect('/products?error=delete_failed');
    }
});

// GET: View the Restock Form
router.get("/restock", ensureAuthenticated, ensureRole('manager'), async (req, res) => {
    const products = await Product.find().sort({ itemName: 1 });
    res.render("restock", { title: "Inventory Restock", products });
});

// POST: Process the Restock
router.post("/restock", ensureAuthenticated, ensureRole('manager'), async (req, res) => {
    try {
        const { productId, addedQuantity } = req.body;
        
        // Find the product and increment the quantity
        await Product.findByIdAndUpdate(productId, {
            $inc: { quantity: parseInt(addedQuantity) }, // Adds to existing stock
            $set: { lastStocked: Date.now() }            // Triggers the "RESTOCKED" badge
        });

        res.redirect("/products/inventory?msg=RestockSuccess");
    } catch (err) {
        res.status(500).send("Error updating stock.");
    }
});

module.exports = router;