const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  type:    { type: String, required: true },
  order:   { type: Number, default: 0 },
  visible: { type: Boolean, default: true },
  content: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { _id: false });

const pageSchema = new mongoose.Schema({
  slug:        { type: String, required: true, unique: true, trim: true },
  title:       { type: String, required: true, trim: true },
  titleAr:     { type: String, trim: true, default: '' },
  metaTitle:   { type: String, default: '' },
  metaTitleAr: { type: String, default: '' },
  metaDesc:    { type: String, default: '' },
  metaDescAr:  { type: String, default: '' },
  ogImage:     { type: String, default: '' },
  sections:    { type: [sectionSchema], default: [] },
  published:   { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Page', pageSchema);
