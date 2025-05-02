const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const authMiddleware = require("../middlewares/auth");

// Get customer's orders
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user }).populate("items.productId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Admin: Get all orders
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user);

    const orders = await Order.find().populate("userId", "username email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Admin: Update order status
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;