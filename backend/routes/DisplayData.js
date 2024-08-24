const express = require('express');
const router = express.Router();

router.post('/foodData', async (req, res) => {
    try {
        // Ensure global variables are set and not undefined
        if (!global.food_items || !global.foodCategory) {
            return res.status(500).json({ error: "Data not loaded properly" });
        }

        const foodItems = global.food_items;
        const foodCategories = global.foodCategory;

        // console.log('Sending Food Items:', foodItems);
        // console.log('Sending Food Categories:', foodCategories);

        res.json([foodItems, foodCategories]); // Send data as JSON
    } catch (error) {
        console.log('Error in /foodData route:', error.message);
        res.status(500).json({ error: "Server error: " + error.message });
    }
});

module.exports = router;
