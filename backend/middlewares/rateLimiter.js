const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => (req.body?.email || "unknown").toLowerCase(),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: " Too many attempts. Please try later.",
  },
});

module.exports = authLimiter;
