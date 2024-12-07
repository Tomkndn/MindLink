const express = require('express');
const { createSingleChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require('../controllers/chat.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const router = express.Router();

router.route('/')
    .post(authenticateToken, createSingleChat)
    .get(authenticateToken, fetchChats)
    

router.route('/group').post(authenticateToken, createGroupChat);
router.route('/rename').put(authenticateToken, renameGroup);
router.route('/groupadd').put(authenticateToken, addToGroup);
router.route('/groupremove').put(authenticateToken, removeFromGroup);


module.exports=router;