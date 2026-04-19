const mongoose = require('mongoose');

/**
 * Testimonial — شهادات العملاء
 * تظهر على الموقع في قسم "ماذا يقول عملاؤنا"
 */
const testimonialSchema = new mongoose.Schema({
  name:        { type: String, required: [true, 'Client name is required'], trim: true },
  nameAr:      { type: String, trim: true, default: '' },
  role:        { type: String, trim: true, default: '' },          // e.g. "Villa Owner, New Cairo"
  roleAr:      { type: String, trim: true, default: '' },
  text:        { type: String, required: [true, 'Testimonial text is required'], trim: true },
  textAr:      { type: String, trim: true, default: '' },
  rating:      { type: Number, min: 1, max: 5, default: 5 },
  avatar:      { type: String, default: '' },                      // optional photo
  source:      { type: String, default: 'google', enum: ['google', 'facebook', 'direct', 'whatsapp'] },
  featured:    { type: Boolean, default: false },
  active:      { type: Boolean, default: true },
  sortOrder:   { type: Number, default: 0 }
}, { timestamps: true });

testimonialSchema.index({ active: 1, featured: 1, sortOrder: 1 });

module.exports = mongoose.model('Testimonial', testimonialSchema);
