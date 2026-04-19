const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name:          { type: String, required: [true, 'Name is required'], trim: true },
  email:         { type: String, trim: true, lowercase: true, default: '' },
  phone:         { type: String, trim: true, default: '' },
  message:       { type: String, required: [true, 'Message is required'], trim: true },
  read:          { type: Boolean, default: false },
  source:        { type: String, default: 'contact_form', enum: ['contact_form', 'whatsapp', 'phone', 'other'] },
  whatsappSent:  { type: Boolean, default: false },
  adminNotes:    { type: String, default: '' }
}, { timestamps: true });

messageSchema.index({ read: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
