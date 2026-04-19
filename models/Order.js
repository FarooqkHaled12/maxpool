const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  id:    { type: String },
  title: { type: String, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  name:          { type: String, required: [true, 'Customer name is required'], trim: true },
  phone:         { type: String, required: [true, 'Phone is required'], trim: true },
  email:         { type: String, trim: true, lowercase: true, default: '' },
  items:         { type: [orderItemSchema], required: true },
  status:        { type: String, enum: ['new', 'contacted', 'quoted', 'confirmed', 'closed', 'cancelled'], default: 'new' },
  notes:         { type: String, default: '' },
  source:        { type: String, default: 'website', enum: ['website', 'whatsapp', 'phone', 'walk_in'] },
  totalEstimate: { type: Number, default: null }
}, { timestamps: true });

orderSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
