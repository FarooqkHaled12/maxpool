const mongoose = require('mongoose');
const slugify  = require('slugify');

const categorySchema = new mongoose.Schema({
  name:           { type: String, required: [true, 'Category name is required'], trim: true, unique: true, maxlength: [60, 'Name cannot exceed 60 characters'] },
  nameAr:         { type: String, trim: true, default: '' },
  slug:           { type: String, unique: true },
  description:    { type: String, trim: true, default: '' },
  descriptionAr:  { type: String, trim: true, default: '' },
  icon:           { type: String, default: 'fa-solid fa-box' },
  image:          { type: String, default: '' },
  sortOrder:      { type: Number, default: 0 },
  active:         { type: Boolean, default: true }
}, { timestamps: true });

categorySchema.pre('save', function(next) {
  if (this.isModified('name')) this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

module.exports = mongoose.model('Category', categorySchema);
