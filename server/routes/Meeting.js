const express = require('express');
const router = express.Router();
const {authenticateToken} = require('../middleware/auth.middleware')
const {HandleTocreateAGroup,HandleToInvitePeople,
    HandleToGetAllMeetings,HandleToGetUpcomingMeetings,
    HandleToGetRecentMeetings,HandleToJoinMeeting,
    HandleToGetMeetingById,getMeetingById} = require('../controllers/meetingController')

router.post('/meet',authenticateToken,HandleTocreateAGroup);
router.post('/invite',authenticateToken,HandleToInvitePeople);
// router.post('/joinmeeting/:id',authenticateToken,HandleToJoinMeeting)
// router.get('/:id',authenticateToken,getMeetingById)
router.get('/allmeetings',authenticateToken,HandleToGetAllMeetings);
router.get('/upcomingmeetings',authenticateToken,HandleToGetUpcomingMeetings);
router.get('/recentmeetings',authenticateToken,HandleToGetRecentMeetings);
module.exports = router;