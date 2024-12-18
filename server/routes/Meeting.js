const express = require('express');
const router = express.Router();
const {authenticateToken} = require('../middleware/auth.middleware')
const {HandleTocreateAGroup,HandleToInvitePeople,
    HandleToGetAllMeetings,HandleToGetUpcomingMeetings,
    HandleToGetRecentMeetings,HandleToJoinMeeting,
    HandleToGetMeetingById,getMeetingById,register,HandleToDeleteMeeting} = require('../controllers/meetingController')
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
router.delete('/delete/:meetingid',authenticateToken,HandleToDeleteMeeting)
module.exports = router;



