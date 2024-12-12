const express = require('express');
const router = express.Router();
const groupController = require('../controllers/GroupController');
const authMiddleware = require('../middleware/auth.middleware'); 

router.post('/create', authMiddleware.authenticateToken, groupController.createGroup);
router.get('/', authMiddleware.authenticateToken, groupController.getGroups);
router.get('/:groupId',authMiddleware.authenticateToken, groupController.getGroupById);
router.put('/:groupId', authMiddleware.authenticateToken, groupController.updateGroup);
router.delete('/:groupId', authMiddleware.authenticateToken, groupController.deleteGroup);
router.post('/:groupId/join', authMiddleware.authenticateToken, groupController.joinGroup);
router.post('/:groupId/invite',authMiddleware.authenticateToken, groupController.inviteUser);
router.post('/invites', authMiddleware.authenticateToken, groupController.getNotifyaboutInvites);
router.post('/invites/accept', authMiddleware.authenticateToken, groupController.acceptGroupInvite);
router.post('/invites/reject', authMiddleware.authenticateToken, groupController.rejectGroupInvite);
router.post('/groups/member', authMiddleware.authenticateToken,groupController.getGroupsByMember);

// Message routes
router.post('/:groupId/messages', authMiddleware.authenticateToken, groupController.sendMessage);
router.get('/:groupId/messages', authMiddleware.authenticateToken,groupController.getMessages); 
module.exports = router;
