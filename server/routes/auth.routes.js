const express = require("express");
const {signup,signin,verify} = require("../controllers/auth.controller");

const router = express.Router();

// signup/signin wala Routes
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/verify", verify);


module.exports = router;
