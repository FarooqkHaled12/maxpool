const mongoose = require('mongoose');
const slugify  = require('slugify');

const blogPostSchema = new mongoose.Schema({
  title:          { type: String, required: true, trim: true },
  titleAr:        { type: String, trim: true, default: '' },
  slug:           { type: String, unique: true },
  content:        { type: String, required: true },
  contentAr:      { type: String, default: '' },
  excerpt:        { type: String, default: '' },
  excerptAr:      { type: String, default: '' },
  featuredImage:  { type: String, default: '' },
  category:       { type: String, default: 'pool-tips' },
  tags:           { type: [String], default: [] },
  published:      { type: Boolean, default: false },
  metaTitle:      { type: String, default: '' },
  metaTitleAr:    { type: String, default: '' },
  metaDesc:       { type: String, default: '' },
  metaDescAr:     { type: String, default: '' },
  readTime:       { type: Number, default: 3 },
  author:         { type: String, default: 'Max Pool Team' },
  views:          { type: Number, default: 0 }
}, { timestamps: true });

blogPostSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

blogPostSchema.index({ published: 1, createdAt: -1 });
blogPostSchema.index({ title: 'text', titleAr: 'text', content: 'text' });

module.exports = mongoose.model('BlogPost', blogPostSchema);
