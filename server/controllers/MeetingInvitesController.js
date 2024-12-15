const Invite = require('../models/MeetingInviteModel');
const Meeting = require('../models/Meetingmodel');
const User = require('../models/User.model');
const mongoose = require('mongoose');

module.exports.inviteUserToMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params; 
    const { email } = req.body; 
    const userId = req.user.id; 


    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

   
    if (meeting.organizer.toString() !== userId) {
      console.log('You are not the organizer of the meeting');
      return res.status(403).json({ message: 'Only the meeting organizer can send invites' });
    }

   
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    if (user._id.toString() === userId) {
      return res.status(400).json({ message: 'You cannot invite yourself' });
    }

    
    const existingInvite = await Invite.findOne({ meetingId, userId: user._id });

    if (existingInvite) {
      return res.status(400).json({ message: 'User has already been invited' });
    }

   
    const invite = new Invite({
      meetingId,
      userId: user._id, 
      status: 'pending',
      invitedAt: new Date(),
    });

    
    await invite.save();

    
    return res.status(201).json({ message: 'User invited successfully', invite });
  } catch (error) {
    console.error('Error inviting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



module.exports.getUserInvites = async (req, res) => {
try {
    const userId = req.user.id;  

    
    const invites = await Invite.find({ userId: userId })
    .populate('meetingId', 'title date description') 
    .populate('userId', 'username email') 
    .sort({ invitedAt: -1 }); 
    if (!invites || invites.length === 0) {
    return res.status(404).json({ message: 'No invites found for this user' });
    }

    return res.status(200).json({ invites });
} catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
}
};


module.exports.updateInviteStatus = async (req, res) => {
  const { inviteId } = req.params;  
  const { status } = req.body;      

  try {
    
    if (!mongoose.Types.ObjectId.isValid(inviteId)) {
      return res.status(400).json({ message: 'Invalid invite ID.' });
    }

    console.log('Invite ID:', inviteId);
    console.log('Status:', status);

   
    const invite = await Invite.findByIdAndUpdate(
      inviteId, 
      { 
        status, 
        respondedAt: Date.now()  
      },
      { new: true }  
    );

    console.log('Updated invite:', invite);

    if (!invite) {
      return res.status(404).json({ message: 'Invite not found.' });
    }

    return res.status(200).json({
      message: 'Invite status updated successfully.',
      invite,
    });
  } catch (err) {
    console.error('Error updating invite status:', err);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
};
