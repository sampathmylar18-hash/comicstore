const express = require("express");
const router = express.Router();
const {
  register,
  login,
  verifyOtp,
} = require("../controllers/authControllers");
const authLimiter = require("../middlewares/rateLimiter");

router.post("/register", register);
router.post("/login", authLimiter, login);
router.post("/verify-otp", authLimiter, verifyOtp);

module.exports = router;
