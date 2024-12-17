const express = require('express');
const {saveSession,calculateTotalFocusTime,getAllFocusSessions} = require('../controllers/FocusSessionController');
const authMiddleware = require('../middleware/auth.middleware'); 
const router = express.Router();

router.post('/save', saveSession);
router.get('/totalhours',authMiddleware.authenticateToken,calculateTotalFocusTime);
router.get('/getsession',authMiddleware.authenticateToken,getAllFocusSessions)
module.exports = router;
