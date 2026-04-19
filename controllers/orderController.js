const asyncHandler = require('../middleware/asyncHandler');
const Order        = require('../models/Order');

exports.createOrder = asyncHandler(async (req, res) => {
  const { name, phone, items } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ success: false, error: 'Valid customer name is required' });
  }
  if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
    return res.status(400).json({ success: false, error: 'Valid phone number is required' });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, error: 'At least one item is required' });
  }
  if (items.some(i => !i.title || typeof i.title !== 'string')) {
    return res.status(400).json({ success: false, error: 'Each item must have a title' });
  }
  const order = await Order.create({ name: name.trim(), phone: phone.trim(), items });
  res.status(201).json({ success: true, data: order });
});

exports.getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).lean();
  res.json({ success: true, count: orders.length, data: orders });
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
  if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
  res.json({ success: true, data: order });
});

exports.deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
  res.json({ success: true, message: 'Order deleted' });
});
