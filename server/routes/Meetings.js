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
   

// router.post("/meeting", async (req, res) => {
//   try {
//     const { title, description, date, time, organizer, privacy, participants, attendees, status } = req.body;

//     // Create a new meeting instance
//     const newMeeting = new Meeting({
//       title,
//       description,
//       date,
//       time,
//       organizer,
//       privacy,
//       participants,
//       attendees,
//       status
//     });

//     // Save the meeting to the database
//     const savedMeeting = await newMeeting.save();
//     console.log(savedMeeting);

//     // Send a successful response with the saved meeting data
//     res.status(201).json(savedMeeting);
//   } catch (error) {
//     console.error("Error creating the meeting:", error.message);
//     res.status(500).json({ error: "Failed to create the meeting." });
//   }
// });
module.exports = router;