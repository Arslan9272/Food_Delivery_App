const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const jwtSecret = "Mynameisendtoedtohelp$#";
const User = require('../models/User');

// Route for creating a new user
router.post("/creatuser", [
    body('email').isEmail(),
    body('password', 'Password must be at least 5 characters long').isLength({ min: 5 }),
    body('name', 'Name is required').notEmpty(),
    body('location', 'Location is required').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Hashing the password with bcrypt
        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(req.body.password, salt);

        // Creating the user in the database
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPassword,
            location: req.body.location
        });

        res.json({ success: true, user });
    } catch (error) {
        console.error('Error while creating user:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Route for logging in a user
router.post("/loginuser", [
    body('email').isEmail(),
    body('password', 'Password must be at least 5 characters long').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Finding the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, error: "Invalid email or password" });
        }

        // Comparing the provided password with the hashed password in the database
        const pwdCompare = await bcrypt.compare(password, user.password);
        if (!pwdCompare) {
            return res.status(400).json({ success: false, error: "Invalid email or password" });
        }

        // Creating a JWT token for the user
        const data = {
            user: {
                id: user.id
            }
        };

        const authToken = jwt.sign(data, jwtSecret);
        res.json({ success: true, authToken: authToken });
    } catch (error) {
        console.error('Error while logging in:', error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

module.exports = router;
