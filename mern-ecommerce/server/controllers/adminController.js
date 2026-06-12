const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

exports.dashboard = asyncHandler(async (_req, res) => {
  const [orderCount, userCount, productCount, revenueAgg] = await Promise.all([
    Order.countDocuments(),
    User.countDocuments(),
    Product.countDocuments(),
    Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
  ]);
  const recentOrders = await Order.find().populate('user', 'name').sort({ createdAt: -1 }).limit(5);
  res.json({
    orderCount, userCount, productCount,
    revenue: revenueAgg[0]?.total || 0, recentOrders,
  });
});

exports.listUsers = asyncHandler(async (_req, res) => {
  res.json(await User.find().select('-password'));
});
