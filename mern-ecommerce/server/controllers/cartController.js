const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');

exports.getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  res.json(cart);
});

exports.addItem = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  const existing = cart.items.find((i) => i.product.toString() === productId);
  if (existing) existing.quantity += Number(quantity);
  else cart.items.push({ product: productId, quantity });
  await cart.save();
  cart = await cart.populate('items.product');
  res.json(cart);
});

exports.updateItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  const item = cart.items.find((i) => i.product.toString() === req.params.productId);
  if (!item) { res.status(404); throw new Error('Item not in cart'); }
  if (quantity <= 0) cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  else item.quantity = quantity;
  await cart.save();
  res.json(await cart.populate('items.product'));
});

exports.removeItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  await cart.save();
  res.json(await cart.populate('items.product'));
});

exports.clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.json({ message: 'Cart cleared' });
});
