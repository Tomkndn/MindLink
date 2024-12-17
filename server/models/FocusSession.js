const mongoose = require('mongoose');

const focusSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  type: { type: String, enum: ['Focus', 'Break'], required: true },
  duration: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FocusSession', focusSessionSchema);
