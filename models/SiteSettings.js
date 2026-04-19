const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  key:   { type: String, required: true, unique: true, trim: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  group: { type: String, default: 'general', enum: ['general', 'contact', 'social', 'seo', 'hero', 'about', 'services'] },
  label: { type: String, default: '' },
  type:  { type: String, default: 'text', enum: ['text', 'textarea', 'url', 'phone', 'email', 'boolean', 'number', 'image'] }
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
