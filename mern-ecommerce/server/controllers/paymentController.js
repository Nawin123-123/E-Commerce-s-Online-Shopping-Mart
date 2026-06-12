const asyncHandler = require('express-async-handler');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
exports.createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body; // in rupees
  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100), currency: 'INR',
    receipt: `rcpt_${Date.now()}`,
  });
  res.json({ orderId: order.id, amount: order.amount, currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID });
});

// Verify HMAC SHA256 signature from Razorpay
exports.verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
  if (expected !== razorpay_signature) {
    res.status(400); throw new Error('Payment verification failed');
  }
  res.json({ success: true });
});
