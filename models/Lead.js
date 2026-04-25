const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  phone:       { type: String, required: true, trim: true },
  email:       { type: String, trim: true, default: '' },
  message:     { type: String, trim: true, default: '' },
  service:     { type: String, default: '', enum: ['', 'equipment_supply', 'installation', 'maintenance', 'chemicals', 'consultation', 'renovation', 'other'] },
  source:      { type: String, default: 'website', enum: ['website', 'whatsapp', 'phone', 'referral', 'social_media', 'other', 'contact_form', 'whatsapp_float', 'whatsapp_product', 'whatsapp_cart', 'cart_submission'] },
  status:      { type: String, default: 'new', enum: ['new', 'contacted', 'converted', 'closed'] },
  notes:       { type: String, default: '' },
  followUpAt:  { type: Date, default: null },
  productId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
  page:        { type: String, default: '' },
}, { timestamps: true });

leadSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Lead', leadSchema);
