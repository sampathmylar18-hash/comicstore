const express = require('express');
const router = express.Router();
const { createRazorpayOrder , verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddle')


router.post('/create-order', createRazorpayOrder);
router.post('/verify',protect,verifyPayment)

module.exports = router;