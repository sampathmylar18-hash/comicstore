const express = require('express')
const router = express.Router();
const { createOrder,getAllOrders,getMyOrders} = require("../controllers/orderController")
const { protect , isAdmin } = require("../middlewares/authMiddle")

router.post('/add', protect , createOrder);
router.get('/get', protect , isAdmin , getAllOrders);
router.get('/my-orders',protect,getMyOrders)
module.exports = router