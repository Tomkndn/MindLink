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
      // Find all focus sessions for the given user with type "Focus"
      console.log(req.user);
      const userId = req.user.id;
      const focusSessions = await FocusSession.find({ userId, type: 'Focus' });

      if (focusSessions.length === 0) {
          return res.status(200).json({ focusTime: '0:00' }); // No focus sessions for this user
      }

      let totalFocusTimeInMinutes = 0;

      // Loop through the focus sessions to calculate total time
      focusSessions.forEach(session => {
          const duration = session.duration;

          // Assuming duration is in "HH:MM:SS" format, convert to minutes
          const [hours, minutes, seconds] = duration.split(':').map(Number);

          // Convert hours and minutes to total minutes
          totalFocusTimeInMinutes += hours * 60 + minutes + (seconds / 60);
      });

      // Convert total minutes to hours and remaining minutes
      const totalHours = Math.floor(totalFocusTimeInMinutes / 60);
      const remainingMinutes = Math.round(totalFocusTimeInMinutes % 60);

      // Format the time in "hours:minutes" format
      const formattedFocusTime = `${totalHours}:${remainingMinutes < 10 ? '0' + remainingMinutes : remainingMinutes}`;

      // Return the formatted total focus time
      return res.status(200).json({ focusTime: formattedFocusTime });
  } catch (error) {
      console.error("Error calculating total focus time:", error);
      res.status(500).json({ message: 'Error calculating total focus time' });
      throw error;
  }
}


module.exports.getAllFocusSessions = async (req, res) => {
  try {
    // Get the user ID from the request (assuming it's passed in the request object)
    const userId = req.user.id;

    // Find all focus sessions for the specific user
    const focusSessions = await FocusSession.find({ userId, type: 'Focus' }); // Filtering for 'Focus' type sessions

    // Check if the user has any focus sessions
    if (!focusSessions || focusSessions.length === 0) {
      return res.status(404).json({ message: 'No focus sessions found for this user.' });
    }

    // Return the found focus sessions in the response
    return res.status(200).json(focusSessions);
  } catch (error) {
    console.error('Error fetching focus sessions:', error);
    return res.status(500).json({ message: 'Error fetching focus sessions.' });
  }
};