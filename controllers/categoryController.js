const asyncHandler = require('../middleware/asyncHandler');
const Category     = require('../models/Category');

exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 }).lean();
  res.json({ success: true, count: categories.length, data: categories });
});

exports.createCategory = asyncHandler(async (req, res) => {
  const { name, description, icon } = req.body;
  if (!name) return res.status(400).json({ success: false, error: 'Category name is required' });
  const category = await Category.create({ name, description, icon });
  res.status(201).json({ success: true, data: category });
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).json({ success: false, error: 'Category not found' });
  res.json({ success: true, message: 'Category deleted' });
});

exports.updateCategory = asyncHandler(async (req, res) => {
  const { name, description, icon } = req.body;
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name, description, icon },
    { new: true, runValidators: true }
  );
  if (!category) return res.status(404).json({ success: false, error: 'Category not found' });
  res.json({ success: true, data: category });
});
