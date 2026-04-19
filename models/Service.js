const mongoose = require('mongoose');
const slugify  = require('slugify');

/**
 * Service — الخدمات المعروضة
 * يتحكم فيها الأدمن من الداشبورد
 */
const serviceSchema = new mongoose.Schema({
  title:          { type: String, required: [true, 'Service title is required'], trim: true },
  titleAr:        { type: String, trim: true, default: '' },
  slug:           { type: String, unique: true },
  description:    { type: String, trim: true, default: '' },
  descriptionAr:  { type: String, trim: true, default: '' },
  icon:           { type: String, default: 'fa-solid fa-wrench' },  // Font Awesome class
  image:          { type: String, default: '' },
  features:       { type: [String], default: [] },                  // bullet points EN
  featuresAr:     { type: [String], default: [] },                  // bullet points AR
  ctaText:        { type: String, default: 'Request Service' },
  ctaTextAr:      { type: String, default: 'طلب الخدمة' },
  ctaLink:        { type: String, default: '/contact.html' },
  color:          { type: String, default: '#0077b6' },             // accent color for card
  active:         { type: Boolean, default: true },
  sortOrder:      { type: Number, default: 0 }
}, { timestamps: true });

serviceSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

serviceSchema.index({ active: 1, sortOrder: 1 });

module.exports = mongoose.model('Service', serviceSchema);
