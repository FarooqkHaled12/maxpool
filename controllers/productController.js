const asyncHandler   = require('../middleware/asyncHandler');
const productService = require('../services/productService');

// Get all products with filtering and pagination
exports.getProducts = async (req, res) => {
  // Check if MongoDB is connected
  const mongoose = require('mongoose');
  
  if (mongoose.connection.readyState !== 1) {
    // MongoDB not connected, use fallback immediately
    console.log('[Fallback] MongoDB not connected, using products.json file');
    const fs = require('fs');
    const path = require('path');
    try {
      const jsonPath = path.join(__dirname, '../../data/products.json');
      const rawData = fs.readFileSync(jsonPath, 'utf8');
      const products = JSON.parse(rawData);
      console.log('[Fallback] Loaded products from JSON:', products.length);
      return res.json({ 
        success: true, 
        products: products.slice(0, 12),
        pagination: { total: products.length, page: 1, limit: 12, pages: 1 }
      });
    } catch (fallbackError) {
      console.error('[Fallback] Error reading products.json:', fallbackError);
      return res.status(500).json({ success: false, error: 'Could not load products' });
    }
  }
  
  // MongoDB is connected, try to use it
  try {
    console.log('[ProductController] getProducts called with query:', req.query);
    const result = await productService.getProducts(req.query);
    console.log('[ProductController] getProducts result:', { 
      productsCount: result.products?.length, 
      pagination: result.pagination 
    });
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('[ProductController] getProducts error:', error);
    
    // Fallback to JSON file if database query fails
    console.log('[Fallback] Database query failed, using products.json file');
    const fs = require('fs');
    const path = require('path');
    try {
      const jsonPath = path.join(__dirname, '../../data/products.json');
      const rawData = fs.readFileSync(jsonPath, 'utf8');
      const products = JSON.parse(rawData);
      console.log('[Fallback] Loaded products from JSON:', products.length);
      res.json({ 
        success: true, 
        products: products.slice(0, 12),
        pagination: { total: products.length, page: 1, limit: 12, pages: 1 }
      });
    } catch (fallbackError) {
      console.error('[Fallback] Error reading products.json:', fallbackError);
      res.status(500).json({ success: false, error: 'Could not load products' });
    }
  }
};

// Get single product by slug
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await productService.getProductBySlug(req.params.slug);
  if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
  res.json({ success: true, data: product });
});

// Get single product by ID
exports.getProductById = asyncHandler(async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('[ProductController] getProductById error:', error);
    
    // Fallback to JSON file if database is not available
    const fs = require('fs');
    const path = require('path');
    try {
      const jsonPath = path.join(__dirname, '../../data/products.json');
      const rawData = fs.readFileSync(jsonPath, 'utf8');
      const products = JSON.parse(rawData);
      const product = products.find(p => p.id === req.params.id);
      
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      
      res.json({ success: true, data: product });
    } catch (fallbackError) {
      console.error('[Fallback] Error reading products.json:', fallbackError);
      res.status(500).json({ success: false, error: 'Could not load product' });
    }
  }
});

// Get featured products
exports.getFeaturedProducts = asyncHandler(async (req, res) => {
  const limit    = Math.min(12, parseInt(req.query.limit) || 3);
  const products = await productService.getFeaturedProducts(limit);
  res.json({ success: true, count: products.length, products });
});

// Create new product (admin only)
exports.createProduct = asyncHandler(async (req, res) => {
  const { name, description, category, brand, brandName, featured } = req.body;
  if (!name || !description || !category) {
    return res.status(400).json({ success: false, error: 'name, description, and category are required' });
  }
  const images = req.files
    ? req.files.map(f => `/uploads/products/${f.filename}`)
    : req.file ? [`/uploads/products/${req.file.filename}`] : [];

  let specifications = [];
  if (req.body.specifications) {
    try { specifications = JSON.parse(req.body.specifications); } catch {}
  }

  const product = await productService.createProduct({
    name, description, category,
    brand:          brand     || '',
    brandName:      brandName || '',
    images,
    specifications,
    featured: featured === 'true'
  });
  res.status(201).json({ success: true, data: product });
});

// Update product (admin only)
exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
  res.json({ success: true, data: product });
});

// Delete product (admin only)
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await productService.deleteProduct(req.params.id);
  if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
  res.json({ success: true, message: 'Product deleted' });
});

// Add images to product (admin only)
exports.addProductImages = asyncHandler(async (req, res) => {
  if (!req.files || !req.files.length) {
    return res.status(400).json({ success: false, error: 'No images uploaded' });
  }
  const newImages = req.files.map(f => `/uploads/products/${f.filename}`);
  const product   = await productService.addImages(req.params.id, newImages);
  if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
  res.json({ success: true, data: product });
});