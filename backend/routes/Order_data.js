const express = require('express');
const router = express.Router();
const Order = require('../models/Orders');

// Endpoint to handle order creation and update
router.post('/orderData', async (req, res) => {
    const { email, order_data, order_date } = req.body;

    console.log('Received request body:', req.body);

    // Validate the input
    if (!email || !order_data || !order_date) {
        return res.status(400).json({ error: "Missing email, order data, or order date." });
    }

    if (!Array.isArray(order_data) || !order_data.every(item =>
        item.hasOwnProperty('id') &&
        item.hasOwnProperty('name') &&
        item.hasOwnProperty('qty') &&
        item.hasOwnProperty('size') &&
        item.hasOwnProperty('price')
    )) {
        return res.status(400).json({ error: "Invalid order data format." });
    }

    // Construct order data with date
    const newOrderData = {
        order_date,
        items: order_data
    };

    try {
        // Check if the order already exists
        let existingOrder = await Order.findOne({ email });

        console.log('Existing order:', existingOrder);

        if (!existingOrder) {
            // Create new order if no existing order is found
            const newOrder = await Order.create({
                email,
                order_data: [newOrderData]
            });
            console.log('Created new order:', newOrder);
        } else {
            // Update existing order
            existingOrder.order_data.push(newOrderData);
            const updatedOrder = await existingOrder.save();
            console.log('Updated existing order:', updatedOrder);
        }

        res.json({ success: true });
    } catch (error) {
        console.error("Server error:", error.message);
        res.status(500).json({ error: "Server error: " + error.message });
    }
});

// Endpoint to fetch order data
router.get('/myorderData', async (req, res) => {
    const { email } = req.query;

    if (!email) {
        console.error("Email is required");
        return res.status(400).json({ error: "Email is required." });
    }

    try {
        console.log(`Fetching orders for email: ${email}`);
        const myData = await Order.findOne({ email });

        if (!myData) {
            console.log("No orders found for this email.");
            return res.status(404).json({ error: "No orders found for this email." });
        }

        console.log("Order data found:", myData);
        res.json({ orderData: myData });
    } catch (error) {
        console.error("Server error:", error.message);
        res.status(500).send("Server error: " + error.message);
    }
});

// Endpoint to clear the cart
router.post('/clearCart', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required." });
    }

    try {
        const updatedOrder = await Order.findOneAndUpdate(
            { email },
            { $set: { order_data: [] } }, // Clear the order_data array
            { new: true }
        );

        if (updatedOrder) {
            res.json({ success: true, message: "Cart cleared successfully" });
        } else {
            res.status(404).json({ success: false, message: "Order not found" });
        }
    } catch (error) {
        console.error("Server error:", error.message);
        res.status(500).send("Server error: " + error.message);
    }
});

module.exports = router;
