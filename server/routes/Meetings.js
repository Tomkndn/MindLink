const express = require('express');
const router = express.Router();
const Meeting = require("../models/Meeting.js");

router.get("/pastmeeting", async (req, res) => {
    try {
      const now = new Date();
  
      const pastMeetings = await Meeting.find({ date: { $lt: now }}).populate('organizer','username');
      console.log(pastMeetings);
      res.status(200).json(pastMeetings);
    } catch (error) {
      console.error("Error fetching past meetings:", error.message);
      res.status(500).json({ error: "Failed to fetch past meetings."});
    }
});
      
module.exports = router;