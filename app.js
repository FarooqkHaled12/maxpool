const express      = require('express');
const cors         = require('cors');
const path         = require('path');
const rateLimit    = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');
const { protect }  = require('./middleware/auth');

const app = express();

// CORS configuration
app.use(cors({ 
  origin: process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.split(',') : '*', 
  methods: ['GET','POST','PUT','PATCH','DELETE'], 
  credentials: true 
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting — skip for authenticated admin requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 500 : 2000,
  message: { success: false, error: 'Too many requests, please try again later.' },
  skip: (req) => req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
});
app.use('/api', limiter);

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import controllers
const productController = require('./controllers/productController');
const categoryController = require('./controllers/categoryController');
const messageController = require('./controllers/messageController');
const orderController = require('./controllers/orderController');

// Public routes — no auth required
app.use('/api/auth', require('./routes/authRoutes'));

// Settings — public GET for frontend
app.get('/api/settings', require('./controllers/settingsController').getSettings);
// Settings full — admin only
app.get('/api/settings/full', protect, require('./controllers/settingsController').getSettingsFull);

// Pages — public GET by slug
app.get('/api/pages/slug/:slug', require('./controllers/pageController').getPage);
app.get('/api/pages',            require('./controllers/pageController').getPages);

// Blog — public GET
app.get('/api/blog',            require('./controllers/blogController').getPosts);
app.get('/api/blog/slug/:slug', require('./controllers/blogController').getPost);

// Leads — public POST (contact form)
app.post('/api/leads', require('./controllers/leadController').createLead);

// Products routes
app.get('/api/products', productController.getProducts);
app.get('/api/products/featured', productController.getFeaturedProducts);
app.get('/api/products/id/:id', productController.getProductById);

// Other public routes
app.get('/api/categories', categoryController.getCategories);
app.post('/api/messages', messageController.createMessage);
app.post('/api/orders', orderController.createOrder);

// Protected admin routes — require JWT
app.use('/api/products',   protect, require('./routes/productRoutes'));
app.use('/api/categories', protect, require('./routes/categoryRoutes'));
app.use('/api/messages',   protect, require('./routes/messageRoutes'));
app.use('/api/orders',     protect, require('./routes/orderRoutes'));
app.use('/api/settings',   protect, require('./routes/settingsRoutes'));
app.use('/api/blog',       protect, require('./routes/blogRoutes'));
app.use('/api/pages',      protect, require('./routes/pageRoutes'));
app.use('/api/leads',      protect, require('./routes/leadRoutes'));

// Health check
app.get('/api/health', (_req, res) => res.json({ 
  success: true, 
  status: 'OK', 
  timestamp: new Date().toISOString() 
}));

// 404 handler
app.use((_req, res) => res.status(404).json({ 
  success: false, 
  error: 'Route not found' 
}));

// Error handler
app.use(errorHandler);

module.exports = app;