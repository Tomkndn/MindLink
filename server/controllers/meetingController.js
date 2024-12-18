const Meeting = require('../models/Meetingmodel')
const User = require('../models/User.model')
const MeetInvites = require('../models/MeetingInviteModel')
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

module.exports.HandleToInvitePeople = async (req, res) => {
    try {
        const { email, meetingId } = req.body;
        console.log("Received request with email:", email, "and meetingId:", meetingId);

        if (!email || !meetingId) {
            console.log('Missing email or meetingId');
            return res.status(400).json({ error: 'All fields are required' });
        }

        const meeting = await Meeting.findById(meetingId);
        const user = await User.findOne({ email });

        if (!meeting) {
            console.log('No meeting found');
            return res.status(404).json({ error: 'Meeting not found' });
        }
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = user.id;
        
        console.log('Participants:', meeting.participants);

        const existingParticipant = meeting.participants.find(
            (participant) => participant.userId && participant.userId.toString() === userId
        );

        console.log('Existing participant:', existingParticipant);

        if (existingParticipant) {
            if (existingParticipant.invited) {
                return res.status(400).json({ message: 'User has already been invited' });
            } else {
                return res.status(400).json({ message: 'User is already part of the meeting' });
            }
        }

        meeting.participants.push({
            username:userId, 
            invited: true,
        });

        await meeting.save();
        console.log('Meeting updated:', meeting);

        if (meeting.privacy === 'private') {
            console.log('Generating password for private meeting');
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
            let password = '';

            for (let i = 0; i < 6; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                password += characters[randomIndex];
            }
            meeting.password = password;
            await meeting.save();
            console.log('Password generated:', password);
        }

        res.status(200).json({
            message: 'User invited successfully',
            meetingId: meeting._id,
            participant: user.username,
            password: meeting.password, 
        });

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Server error during group invite' });
    }
};



// '/meetings/:meetingId/join',
module.exports.HandleToJoinMeeting = async (req, res) => {
    try {
        const userId = req.user.id; 
        const meetingId = req.params.id; 
        console.log(userId)
       
        const meeting = await Meeting.findById(meetingId);

        if (!meeting) {
            console.log("meeting not found");
            return res.status(404).json({ message: 'Meeting not found' });
        }

        const currentTime = new Date();
        if (currentTime > meeting.date) {
            return res.status(400).json({ message: 'Meeting has expired' });
        }

        if (meeting.isPublic) {
           
            if (!meeting.attendees.includes(userId)) {
                meeting.attendees.push(userId);
                await meeting.save();
                return res.status(200).json({ message: 'User joined the meeting successfully' });
            } else {
                console.log(meeting);
                return res.status(400).json({ message: 'User has already joined the meeting' });
            }
            
        } else {
            
            const existingParticipant = meeting.participants.find(participant => participant.userId.toString() === userId);
            
            if (existingParticipant && existingParticipant.invited) {
                
                if (!meeting.attendees.includes(userId)) {
                    meeting.attendees.push(userId);
                    await meeting.save();
                    return res.status(200).json({ message: 'User joined the meeting successfully' });
                } else {
                    return res.status(400).json({ message: 'User has already joined the meeting' });
                }
            } else {
                
                return res.status(400).json({ message: 'User is not invited to the meeting' });
            }
        }
    } catch (error) {
        console.error('Error joining meeting:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

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


module.exports.HandleToGetUpcomingMeetings = async (req, res) => {
    try {
      const currentDate = new Date();
      const userId = req.user.id; 
  
      
      const upcomingMeetings = await Meeting.find({
        $or: [
          { organizer: userId }, 
          { 'participants.username': userId }, 
        ],
        date: { $gte: currentDate }, 
        status: { $in: ['scheduled', 'completed'] }, 
      })
        .sort({ date: 1 }) 
        .populate('organizer', 'username') 
        .populate('participants.username', 'username') 
        .populate('attendees', 'username'); 
  
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
      
      
      const recentMeetings = await Meeting.find({
        date: { $lt: currentDate },
        status: 'completed', 
        organizer: userId, 
      })
        .sort({ date: -1 })
        .populate('organizer', 'username')
        .populate('participants.username', 'username')
        .populate('attendees', 'username');
      
      
      res.status(200).json(recentMeetings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching recent meetings' });
    }
  };


module.exports.getMeetingById = async (req, res) => {
    try {
   
      const meetingId = req.params.id.trim(); 
      console.log('Meeting ID from params:', meetingId);
     
      if (!mongoose.Types.ObjectId.isValid(meetingId)) {
        return res.status(400).json({ message: 'Invalid meeting ID format' });
      }
  
     
      const meeting = await Meeting.findById(meetingId);
  
      if (!meeting) {
        
        return res.status(404).json({ message: 'Meeting not found' });
      }
  
      
      res.json(meeting);
  
    } catch (error) {
      
      console.error('Error fetching meeting:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  };

  module.exports.register = async (req, res) => {
    try {
      const { meetingId } = req.params; 
      const userId = req.user.id; 
    
      
      const meeting = await Meeting.findById(meetingId);
      if (!meeting) {
        return res.status(404).json({ message: 'Meeting not found' });
      }
  
      
      if (meeting.organizer.toString() === userId) {
        return res.status(403).json({ message: 'You cannot register for your own meeting' });
      }
  
      
      const existingParticipant = meeting.participants.find(participant => participant.userId.toString() === userId);
  
      if (existingParticipant) {
        return res.status(400).json({ message: 'User has already registered for the meeting' });
      }
    
      
      meeting.participants.push({
        userId,
        invited: true, 
      });
    
     
      await meeting.save();
    
      return res.status(200).json({ message: 'Successfully registered for the meeting' });
    } catch (err) {
      console.error('Error registering user:', err);
      return res.status(500).json({ message: 'Server Error' });
    }
  };
  