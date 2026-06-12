const router = require('express').Router();
const c = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
router.post('/create-order', protect, c.createRazorpayOrder);
router.post('/verify', protect, c.verifyPayment);
module.exports = router;
