const express = require('express');
const {saveSession} = require('../controllers/FocusSessionController');
const router = express.Router();

router.post('/save', saveSession);
module.exports = router;
