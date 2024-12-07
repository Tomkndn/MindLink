const mongoose = require('mongoose');
const FocusSession =require('../models/FocusSession')
module.exports.saveSession = async (req, res) => {
    // console.log(user);
  try {
    console.log("Incoming payload:", req.body);
    const { type, duration, userId } = req.body;

    if (!type || !duration || !userId) {
      return res.status(400).json({ message: 'Type, duration, and userId are required.' });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId.' });
    }

    const newSession = new FocusSession({ type, duration, userId });
    await newSession.save();
    res.status(201).json({ message: 'Session saved successfully', session: newSession });
  } catch (error) {
    console.error("Error saving session:", error);
    res.status(500).json({ message: 'Error saving session' });
  }
};
