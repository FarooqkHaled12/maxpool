const jwt          = require('jsonwebtoken');
const Admin        = require('../models/Admin');
const asyncHandler = require('../middleware/asyncHandler');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, error: 'Email and password are required' });
  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin || !(await admin.comparePassword(password))) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
  const token = signToken(admin._id);
  res.json({ success: true, token, admin: { id: admin._id, email: admin.email, name: admin.name } });
});

exports.getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, admin: req.admin });
});
