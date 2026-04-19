const asyncHandler = require('../middleware/asyncHandler');
const Message      = require('../models/Message');

exports.createMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ success: false, error: 'Valid name (min 2 chars) is required' });
  }
  if (!message || typeof message !== 'string' || message.trim().length < 5) {
    return res.status(400).json({ success: false, error: 'Valid message (min 5 chars) is required' });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email format' });
  }
  const msg = await Message.create({
    name:    name.trim(),
    email:   email?.trim()   || '',
    phone:   phone?.trim()   || '',
    message: message.trim()
  });
  res.status(201).json({ success: true, data: msg });
});

exports.getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 }).lean();
  res.json({ success: true, count: messages.length, data: messages });
});

exports.markRead = asyncHandler(async (req, res) => {
  const msg = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  if (!msg) return res.status(404).json({ success: false, error: 'Message not found' });
  res.json({ success: true, data: msg });
});

exports.deleteMessage = asyncHandler(async (req, res) => {
  const msg = await Message.findByIdAndDelete(req.params.id);
  if (!msg) return res.status(404).json({ success: false, error: 'Message not found' });
  res.json({ success: true, message: 'Message deleted' });
});
