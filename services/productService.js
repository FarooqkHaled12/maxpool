const Product = require('../models/Product');

const buildQuery = ({ category, brand, search, featured }) => {
  const filter = {};
  if (category) filter.category = category;
  if (brand)    filter.brand    = brand;
  if (featured === 'true') filter.featured = true;
  if (search) {
    filter.$or = [
      { name:        { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { brandName:   { $regex: search, $options: 'i' } }
    ];
  }
  return filter;
};

const getProducts = async (queryParams) => {
  const page  = Math.max(1, parseInt(queryParams.page)  || 1);
  const limit = Math.min(50, parseInt(queryParams.limit) || 12);
  const skip  = (page - 1) * limit;
  const sortMap = { newest: { createdAt: -1 }, oldest: { createdAt: 1 }, name_az: { name: 1 }, name_za: { name: -1 } };
  const sort   = sortMap[queryParams.sort] || { createdAt: -1 };
  const filter = buildQuery(queryParams);
  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limit).lean().maxTimeMS(3000),
    Product.countDocuments(filter).maxTimeMS(3000)
  ]);
  return { products, pagination: { total, page, limit, pages: Math.ceil(total / limit), hasNext: page < Math.ceil(total / limit), hasPrev: page > 1 } };
};

const getProductBySlug    = async (slug)      => Product.findOne({ slug }).lean();
const getProductById      = async (id)        => Product.findById(id).lean();
const getFeaturedProducts = async (limit = 3) => Product.find({ featured: true }).sort({ createdAt: -1 }).limit(limit).lean();
const createProduct       = async (data)      => Product.create(data);
const updateProduct       = async (id, data)  => Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
const deleteProduct       = async (id)        => Product.findByIdAndDelete(id);
const addImages           = async (id, imgs)  => Product.findByIdAndUpdate(id, { $push: { images: { $each: imgs } } }, { new: true });

module.exports = { getProducts, getProductBySlug, getProductById, getFeaturedProducts, createProduct, updateProduct, deleteProduct, addImages };
