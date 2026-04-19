const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/productController');
const upload  = require('../middleware/upload');

// POST / — create product (protected via app.use middleware)
router.post('/', upload.array('images', 5), ctrl.createProduct);

// GET /featured — fetch featured products (used by homepage)
router.get('/featured', ctrl.getFeaturedProducts);

// GET /id/:id — fetch single product by MongoDB _id (used by frontend product.html)
router.get('/id/:id', ctrl.getProductById);

// GET /:slug — fetch single product by slug
router.get('/:slug', ctrl.getProduct);

// PUT /:id / DELETE /:id — update / delete by MongoDB _id
router.put('/:id',    ctrl.updateProduct);
router.delete('/:id', ctrl.deleteProduct);

// PATCH /:id/images — add more images to existing product
router.patch('/:id/images', upload.array('images', 5), ctrl.addProductImages);

module.exports = router;
