const express = require("express");
const { getUserData, updateUserData, searchUsers } = require("../controllers/user.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

// particular user k liye
router.route("/:id").all(authenticateToken).get(getUserData).put(updateUserData);
router.route('/').get(authenticateToken, searchUsers);


module.exports = router;
