const Meeting = require('../models/Meetingmodel')
const User = require('../models/User.model')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
module.exports.HandleTocreateAGroup=async(req,res)=>{
    try{
    const {title, description , date , time , privacy} = req.body;

    if(!title || !description || !date || !time || !privacy){
        return res.status(400).json({error: 'All fields are required'});
    }

    const decode = req.user;
    const userid = decode.id;
    const user = await User.findById(userid);

    if(!user)
    {
        res.status(404).json({error: 'user not found'});
    }

    const meeting = new Meeting({
        title,
        description,
        date,
        time,
        privacy,
        organizer: userid,
    });

    await meeting.save();
    res.status(201).json({message: 'Group created successfully', meeting});
    }catch(err)
    {   
        console.log("error occured", err);
        res.status(500).json({error: `Server error during group creation ${err} `});
    }
}

module.exports.HandleToInvitePeople = async (req,res) =>{
    try{
        const {email , meetingname} = req.body;
        if(!email ||!meetingname){
            return res.status(400).json({error: 'All fields are required'});
        }

        const meeting = await Meeting.findOne({title: meetingname});
        const user = await User.findOne({email});
        if(!meeting)
        {
            return res.status(404).json({error: 'Meeting not found'});
        }
        if(!user)
        {
            return res.status(404).json({error: 'User not found'});
        }
        const userId = user.id;
        const existingParticipant = meeting.participants.find(
            (participant) => participant.username.toString() === userId
        );

        if (existingParticipant) {
            if (existingParticipant.invited) {
                return res.status(400).json({ message: 'User has already been invited' });
            } else {
                return res.status(400).json({ message: 'User is already part of the meeting' });
            }
        }

        meeting.participants.push({
            username: userId,
            invited: true,
        });
        
        await meeting.save();

        if(meeting.privacy == 'private') {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
        let password = '';
        
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            password += characters[randomIndex];
        }
        meeting.password = password;
        await meeting.save();
    }

        res.status(200).json({
            message: 'User invited successfully',
            meetingId: meeting._id,
            participant: user.username,
            password: meeting.password,
        });
        
    }catch(err)
    {
        res.status(500).json({error: 'Server error during group invite'});
    }
}
// '/meetings/:meetingId/join',
module.exports.HandleToJoinMeeting = async (req, res) => {
    try {
        const { userId } = req.user.id; // Assuming userId is sent in the request body
        const meetingId = req.params.id; // Meeting ID from the URL parameters
        console.log()
        // Find the meeting by ID
        const meeting = await Meeting.findById(meetingId);

        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }

        // Check if the meeting is public
        if (meeting.isPublic) {
            // If it's a public meeting, add the user directly to the attendees list
            if (!meeting.attendees.includes(userId)) {
                meeting.attendees.push(userId);
                await meeting.save();
                return res.status(200).json({ message: 'User joined the meeting successfully' });
            } else {
                console.log(meeting);
                return res.status(400).json({ message: 'User has already joined the meeting' });
            }
            
        } else {
            // For private meetings, check if the user is invited
            const existingParticipant = meeting.participants.find(participant => participant.userId.toString() === userId);
            
            if (existingParticipant && existingParticipant.invited) {
                // If the user is invited, add them to the attendees list
                if (!meeting.attendees.includes(userId)) {
                    meeting.attendees.push(userId);
                    await meeting.save();
                    return res.status(200).json({ message: 'User joined the meeting successfully' });
                } else {
                    return res.status(400).json({ message: 'User has already joined the meeting' });
                }
            } else {
                // If the user is not invited to the private meeting
                return res.status(400).json({ message: 'User is not invited to the meeting' });
            }
        }
    } catch (error) {
        console.error('Error joining meeting:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
//'/user/:userId/meetings/created'
module.exports.HandleToGetAllMeetings = async (req, res) => {
    const userId = req.user.id; 
    try {
        const meetings = await Meeting.find({
            organizer: mongoose.Types.ObjectId(userId) 
        })
        .populate('organizer', 'username') 
        .sort({ date: 1 }); 

        if (!meetings || meetings.length === 0) {
            return res.status(404).json({ message: 'No meetings found created by this user' });
        }
        
        res.status(200).json(meetings);
    } catch (error) {
        console.error('Error fetching meetings created by user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// '/recentmeetings'
module.exports.HandleToGetUpcomingMeetings = async (req, res) => {
    try {
      const currentDate = new Date();
      const userId = req.user.id; 
      console.log(userId)
      const upcomingMeetings = await Meeting.find({
        date: { $gte: currentDate }, 
        status: { $in: ['scheduled', 'completed'] }, 
      })
        .sort({ date: 1 }) 
        .populate('organizer', 'username') 
        .populate('participants.username', 'username') 
        .populate('attendees', 'username');

      console.log(upcomingMeetings)
      res.status(200).json(upcomingMeetings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching upcoming meetings' });
    }
  };

  module.exports.HandleToGetRecentMeetings = async (req, res) => {
    try {
      const currentDate = new Date();
      const userId = req.user.id; 
        console.log(userId)
      // Find all completed meetings where the user is the organizer and the date is in the past.
      
      const recentMeetings = await Meeting.find({
        date: { $lt: currentDate },
        status: 'completed', 
        organizer: userId, 
      })
        .sort({ date: -1 })
        .populate('organizer', 'username')
        .populate('participants.username', 'username')
        .populate('attendees', 'username');
      
        console.log(recentMeetings)
      // Respond with the list of recent meetings
      res.status(200).json(recentMeetings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching recent meetings' });
    }
  };


module.exports.getMeetingById = async (req, res) => {
    try {
    //   const meetingId = req.params.id; // Get meeting ID from the URL params
      const meetingId = req.params.id.trim(); // Trim any leading or trailing spaces
      console.log('Meeting ID from params:', meetingId); // Log the ID
      // Check if the meetingId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(meetingId)) {
        return res.status(400).json({ message: 'Invalid meeting ID format' });
      }
  
      // Find the meeting by ID
      const meeting = await Meeting.findById(meetingId);
  
      if (!meeting) {
        // If no meeting is found with the given ID, return a 404 response
        return res.status(404).json({ message: 'Meeting not found' });
      }
  
      // Return the found meeting in the response
      res.json(meeting);
  
    } catch (error) {
      // Catch any other errors and send a 500 internal server error response
      console.error('Error fetching meeting:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  };