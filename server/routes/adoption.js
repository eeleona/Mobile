// server/routes/adoption.js
const express = require('express');
const router = express.Router();
const Adoption = require('../models/adoption_model'); // Import your Adoption model

// Fetch adoption status for the logged-in user
router.get('/adoption-status', async (req, res) => {
    try {
        const { userId } = req.query; // Assuming the user ID is passed as a query parameter
        
        // Fetch adoption status for the user
        const adoption = await Adoption.findOne({ v_id: userId }).sort({ a_submitted_at: -1 }); // Fetch most recent adoption
        
        if (adoption) {
            res.json({ status: adoption.status, failedReason: adoption.failedReason });
        } else {
            res.status(404).json({ message: 'No adoption data found for this user' });
        }
    } catch (error) {
        console.error('Error fetching adoption status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
