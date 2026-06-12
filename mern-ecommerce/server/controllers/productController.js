const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @route GET /api/products  — with search, filter, sort, pagination
exports.list = asyncHandler(async (req, res) => {
  const { q, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
  const filter = {};
  if (q) filter.title = { $regex: q, $options: 'i' };
  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  const sortMap = { 'price-asc': { price: 1 }, 'price-desc': { price: -1 }, 'rating': { rating: -1 }, 'newest': { createdAt: -1 } };
  const sortObj = sortMap[sort] || { createdAt: -1 };
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Product.find(filter).sort(sortObj).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

exports.featured = asyncHandler(async (_req, res) => {
  res.json(await Product.find({ isFeatured: true }).limit(8));
});

exports.getBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate('reviews.user', 'name avatar');
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json(product);
});

exports.categories = asyncHandler(async (_req, res) => {
  res.json(await Product.distinct('category'));
});

// Admin
exports.create = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});
exports.update = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) { res.status(404); throw new Error('Not found'); }
  res.json(product);
});
exports.remove = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// Reviews
exports.addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Not found'); }
  if (product.reviews.find((r) => r.user.toString() === req.user._id.toString())) {
    res.status(400); throw new Error('You already reviewed this product');
  }
  product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
  product.calculateRating();
  await product.save();
  res.status(201).json({ message: 'Review added' });
});
