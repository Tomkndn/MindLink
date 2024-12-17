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
module.exports.calculateTotalFocusTime = async (req, res) => {
  try {
      console.log(req.user);
      const userId = req.user.id;
      const focusSessions = await FocusSession.find({ userId, type: 'Focus' });

      if (focusSessions.length === 0) {
          return res.status(200).json({ focusTime: '0:00' }); 
      }

      let totalFocusTimeInMinutes = 0;
      focusSessions.forEach(session => {
          const duration = session.duration;
          const [hours, minutes, seconds] = duration.split(':').map(Number);
          totalFocusTimeInMinutes += hours * 60 + minutes + (seconds / 60);
      });
      const totalHours = Math.floor(totalFocusTimeInMinutes / 60);
      const remainingMinutes = Math.round(totalFocusTimeInMinutes % 60);
      const formattedFocusTime = `${totalHours}:${remainingMinutes < 10 ? '0' + remainingMinutes : remainingMinutes}`;
      return res.status(200).json({ focusTime: formattedFocusTime });
  } catch (error) {
      console.error("Error calculating total focus time:", error);
      res.status(500).json({ message: 'Error calculating total focus time' });
      throw error;
  }
}


module.exports.getAllFocusSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    const focusSessions = await FocusSession.find({ userId, type: 'Focus' });
    if (!focusSessions || focusSessions.length === 0) {
      return res.status(404).json({ message: 'No focus sessions found for this user.' });
    }
    return res.status(200).json(focusSessions);
  } catch (error) {
    console.error('Error fetching focus sessions:', error);
    return res.status(500).json({ message: 'Error fetching focus sessions.' });
  }
};