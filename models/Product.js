const mongoose = require('mongoose');
const slugify  = require('slugify');

const specSchema = new mongoose.Schema({
  label:   { type: String, required: true },
  value:   { type: String, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name:           { type: String, required: [true, 'Product name is required'], trim: true, maxlength: [120, 'Name cannot exceed 120 characters'] },
  nameAr:         { type: String, trim: true, default: '' },
  slug:           { type: String, unique: true },
  description:    { type: String, required: [true, 'Description is required'], trim: true },
  descriptionAr:  { type: String, trim: true, default: '' },
  category:       { type: String, required: [true, 'Category is required'], trim: true },
  brand:          { type: String, trim: true, default: '' },
  brandName:      { type: String, trim: true, default: '' },
  images:         { type: [String], default: [] },
  price:          { type: Number, default: null },           // optional — shown if set
  priceNote:      { type: String, default: '' },             // e.g. "يبدأ من" / "Call for price"
  stock:          { type: String, enum: ['in_stock', 'out_of_stock', 'on_order'], default: 'in_stock' },
  specifications: { type: [specSchema], default: [] },
  featured:       { type: Boolean, default: false },
  active:         { type: Boolean, default: true },
  sortOrder:      { type: Number, default: 0 }
}, { timestamps: true });

productSchema.pre('save', function(next) {
  if (this.isModified('name')) this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

productSchema.index({ name: 'text', nameAr: 'text', description: 'text', brandName: 'text' });
productSchema.index({ category: 1, featured: 1, active: 1 });

module.exports = mongoose.model('Product', productSchema);
