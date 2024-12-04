const express = require('express');
const { authenticateToken } = require('../middleware/auth.middleware');
const { sendMessage, getAllMessages } = require('../controllers/message.controller');
const router = express.Router();

router.route('/').post(authenticateToken, sendMessage)
router.route('/:chatId').get(authenticateToken, getAllMessages);

module.exports=router;