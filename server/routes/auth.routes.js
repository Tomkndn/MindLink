const express = require("express");
const {
  signup,
  signin,
  verify,
  googleSign,
} = require("../controllers/auth.controller");

const router = express.Router();

// signup/signin wala Routes
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/verify", verify);
router.post("/google", googleSign);


module.exports = router;
