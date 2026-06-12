const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const sendEmail = require('../utils/sendEmail');

// Create order (called AFTER payment is verified)
exports.create = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentData } = req.body;
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) { res.status(400); throw new Error('Cart is empty'); }

  const items = cart.items.map((i) => ({
    product: i.product._id, title: i.product.title,
    image: i.product.images?.[0]?.url || '', price: i.product.price, quantity: i.quantity,
  }));
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal > 499 ? 0 : 40;

  const order = await Order.create({
    user: req.user._id, items, shippingAddress, subtotal, shipping,
    total: subtotal + shipping, paymentStatus: 'paid',
    razorpayOrderId: paymentData.razorpay_order_id,
    razorpayPaymentId: paymentData.razorpay_payment_id,
    razorpaySignature: paymentData.razorpay_signature,
  });
  cart.items = []; await cart.save();

  sendEmail({
    to: req.user.email, subject: `Order Confirmed #${order._id}`,
    html: `<h2>Thanks for your order!</h2><p>Total: ₹${order.total}</p>`,
  }).catch(() => {});

  res.status(201).json(order);
});

exports.myOrders = asyncHandler(async (req, res) => {
  res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }));
});

exports.getById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Not found'); }
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Forbidden');
  }
  res.json(order);
});

// Admin
exports.listAll = asyncHandler(async (_req, res) => {
  res.json(await Order.find().populate('user', 'name email').sort({ createdAt: -1 }));
});
exports.updateStatus = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status, ...(req.body.status === 'delivered' && { deliveredAt: new Date() }) },
    { new: true }
  );
  res.json(order);
});
