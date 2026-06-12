const asyncHandler = require('express-async-handler');
const Address = require('../models/Address');

exports.list = asyncHandler(async (req, res) => res.json(await Address.find({ user: req.user._id })));

exports.create = asyncHandler(async (req, res) => {
  const addr = await Address.create({ ...req.body, user: req.user._id });
  res.status(201).json(addr);
});

exports.update = asyncHandler(async (req, res) => {
  const addr = await Address.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id }, req.body, { new: true }
  );
  res.json(addr);
});

exports.remove = asyncHandler(async (req, res) => {
  await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.json({ message: 'Deleted' });
});
