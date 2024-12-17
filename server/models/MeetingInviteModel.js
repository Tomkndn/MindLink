const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema({
  meetingId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Meeting', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'declined'], 
    default: 'pending' 
  },
  invitedAt: { 
    type: Date, 
    default: Date.now 
  },
  respondedAt: { 
    type: Date, 
    default: null 
  }
});


const Invite = mongoose.model('Invite', inviteSchema);

module.exports = Invite;