const express = require("express");
const router = express.Router();
const Credit = require("../models/Credit");
const { ensureAuthenticated, ensureRole } = require("../middleware/auth");

// GET: Display Credit Management Page
router.get("/", ensureAuthenticated, ensureRole("Admin"), async (req, res) => {
  try {
    const credits = await Credit.find().sort({ dueDate: 1 });

    // Calculate total debt for the dashboard card
    const totalPending = credits
      .filter((c) => c.status === "Pending")
      .reduce((acc, curr) => acc + curr.amountOwed, 0);

    res.render("supplierCredit", {
      title: "Supplier Credit Tracking",
      credits: credits,
      totalPending: totalPending.toLocaleString(),
    });
  } catch (err) {
    res.status(500).send("Database Error: " + err.message);
  }
});

// POST: Record New Supplier Credit
router.post(
  "/add",
  ensureAuthenticated,
  ensureRole("Admin"),
  async (req, res) => {
    try {
      const { supplierName, item, amountOwed, dueDate, quantity, unit } =
        req.body;

      // Validation
      if (
        !supplierName ||
        !item ||
        !amountOwed ||
        !dueDate ||
        !quantity ||
        !unit
      ) {
        const credits = await Credit.find();
        return res.render("supplierCredit", {
          credits,
          error: "All fields are required.",
        });
      }

      if (isNaN(amountOwed) || amountOwed <= 0) {
        const credits = await Credit.find();
        return res.render("supplierCredit", {
          credits,
          error: "Invalid amount owed.",
        });
      }
      if (isNaN(quantity) || quantity <= 0 || !Number.isInteger(Number(quantity))) {
        const credits = await Credit.find();
        return res.render("supplierCredit", {
          credits,
          error: "Invalid quantity.",
        });
      }
      if (new Date(dueDate) < new Date()) {
        const credits = await Credit.find();
        return res.render("supplierCredit", {
          credits,
          error: "Invalid due date.",
        });
      }
      if (unit.trim() === "" || !["Piece", "Box", "Kg", "Liter", "Sheet", "Roll", "Bag", "Meter",].includes(unit)) {
        const credits = await Credit.find();
        return res.render("supplierCredit", {
          credits,
          error: "Invalid unit.",
        });
      }
      if (supplierName.trim() === "" ) {
        const credits = await Credit.find();
        return res.render("supplierCredit", {
          credits,
          error: "Invalid supplier name.",
        });
      }
      if (item.trim() === "") {
        const credits = await Credit.find();
        return res.render("supplierCredit", {
          credits,
          error: "Invalid item description.",
        });
      }

      const newCredit = new Credit({
        supplierName,
        item,
        quantity,
        unit,
        amountOwed: parseFloat(amountOwed),
        dueDate,
      });

      await newCredit.save();
      res.redirect("/credit");
    } catch (err) {
      console.error("Error saving credit:", err);
      const credits = await Credit.find();
      res.render("supplierCredit", {
        credits,
        error: "Failed to save: " + err.message,
      });
    }
  },
);

// POST: Mark Credit as Paid
router.post(
  "/pay/:id",
  ensureAuthenticated,
  ensureRole("Admin"),
  async (req, res) => {
    try {
      await Credit.findByIdAndUpdate(req.params.id, { status: "Paid" });
      res.redirect("/credit");
    } catch (err) {
      res.status(500).send("Update Error");
    }
  },
);

module.exports = router;
