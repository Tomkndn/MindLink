const express = require('express');
const router = express.Router();
const {authenticateToken} = require('../middleware/auth.middleware')
const {HandleTocreateAGroup,HandleToInvitePeople,
    HandleToGetAllMeetings,HandleToGetUpcomingMeetings,
    HandleToGetRecentMeetings,HandleToJoinMeeting,
    HandleToGetMeetingById,getMeetingById,register} = require('../controllers/meetingController')
const inviteController = require('../controllers/MeetingInvitesController');

router.post('/meet',authenticateToken,HandleTocreateAGroup);
router.post('/invite/:meetid',authenticateToken,HandleToInvitePeople);
router.post('/joinmeeting/:id',authenticateToken,HandleToJoinMeeting)
router.post('/invitation/:meetingId',authenticateToken,inviteController.inviteUserToMeeting);
router.post('/register/:meetingId',authenticateToken,register)
router.get('/meetinginvites',authenticateToken,inviteController.getUserInvites)
router.patch('/updateinvite/:inviteId',authenticateToken,inviteController.updateInviteStatus)
router.get('/allmeetings',authenticateToken,HandleToGetAllMeetings);
router.get('/upcomingmeetings',authenticateToken,HandleToGetUpcomingMeetings);
router.get('/recentmeetings',authenticateToken,HandleToGetRecentMeetings);
module.exports = router;



// const express = require('express');
// const router = express.Router();
// const Meeting = require("../models/Meeting.js");

// router.get("/pastmeeting", async (req, res) => {
//     try {
//       const now = new Date();
  
//       const pastMeetings = await Meeting.find({ date: { $lt: now }}).populate('organizer','username');
//       console.log(pastMeetings);
//       res.status(200).json(pastMeetings);
//     } catch (error) {
//       console.error("Error fetching past meetings:", error.message);
//       res.status(500).json({ error: "Failed to fetch past meetings."});
//     }
// });
      
// module.exports = router;