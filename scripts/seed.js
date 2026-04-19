require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Product  = require('../models/Product');
const Category = require('../models/Category');
const Admin    = require('../models/Admin');
const rawProducts = require('../../data/products.json');

const CATEGORIES = [
  { name: 'Pool Pumps',            slug: 'cat-pumps',        description: 'طلمبات حمامات السباحة عالية الكفاءة',   icon: 'fa-solid fa-water' },
  { name: 'Pool Filters',          slug: 'cat-filters',      description: 'فلاتر حمامات السباحة للمياه الصافية',    icon: 'fa-solid fa-filter' },
  { name: 'Pool Lighting',         slug: 'cat-lights',       description: 'إضاءات وكشافات حمامات السباحة',          icon: 'fa-solid fa-lightbulb' },
  { name: 'Pool Fittings',         slug: 'cat-fittings',     description: 'اكسسوارات وتجهيزات حمامات السباحة',      icon: 'fa-solid fa-toolbox' },
  { name: 'Pool Chemicals',        slug: 'cat-chemicals',    description: 'كيماويات معالجة مياه حمامات السباحة',    icon: 'fa-solid fa-flask' },
  { name: 'Pool Cleaners',         slug: 'cat-cleaners',     description: 'أطقم وأدوات تنظيف حمامات السباحة',       icon: 'fa-solid fa-broom' },
  { name: 'Water Testing',         slug: 'cat-testing',      description: 'أدوات اختبار مياه حمام السباحة',         icon: 'fa-solid fa-vial' },
  { name: 'Jacuzzi',               slug: 'cat-jacuzzi',      description: 'جاكوزي وملحقاته',                        icon: 'fa-solid fa-hot-tub-person' },
  { name: 'Pool Heaters',          slug: 'cat-heaters',      description: 'سخانات حمامات السباحة',                  icon: 'fa-solid fa-temperature-high' },
  { name: 'Pool Ladders',          slug: 'cat-ladders',      description: 'سلالم حمامات السباحة',                   icon: 'fa-solid fa-stairs' },
  { name: 'Waterfalls',            slug: 'cat-waterfalls',   description: 'شلالات حمامات السباحة',                  icon: 'fa-solid fa-droplet' },
  { name: 'Spare Parts',           slug: 'cat-spareparts',   description: 'قطع غيار معدات حمامات السباحة',          icon: 'fa-solid fa-gears' },
  { name: 'Control Units',         slug: 'cat-controls',     description: 'وحدات التحكم في حمامات السباحة',         icon: 'fa-solid fa-sliders' },
  { name: 'Pipeless Filter Units', slug: 'cat-pipeless',     description: 'وحدات الفلترة الجاهزة بدون أنابيب',      icon: 'fa-solid fa-circle-nodes' },
  { name: 'Transformers',          slug: 'cat-transformers', description: 'محولات كهرباء حمامات السباحة',           icon: 'fa-solid fa-bolt' },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Seed] Connected to MongoDB');
    await Promise.all([Product.deleteMany(), Category.deleteMany()]);
    console.log('[Seed] Cleared existing data');
    await Category.insertMany(CATEGORIES);
    console.log(`[Seed] Inserted ${CATEGORIES.length} categories`);
    const products = rawProducts
      .filter(p => (p.title || p.name))
      .map((p, i) => {
        const name = (p.title || p.name).trim();
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + (i + 1);
        return {
          name,
          slug,
          description: p.description || p.shortDesc || '',
          category:    p.category || p.categorySlug || '',
          brand:       p.brand || '',
          brandName:   p.brandName || '',
          images:      [p.image || p.imagePath || ''].filter(Boolean),
          featured:    false
        };
      });
    await Product.insertMany(products);
    console.log(`[Seed] Inserted ${products.length} products`);
    await Admin.deleteMany();
    await Admin.create({ email: process.env.ADMIN_EMAIL || 'admin@maxpool.com', password: process.env.ADMIN_PASSWORD || 'Admin@123456', name: 'Max Pool Admin' });
    console.log(`[Seed] Admin created: ${process.env.ADMIN_EMAIL || 'admin@maxpool.com'}`);
    console.log('[Seed] Done!');
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error:', err.message);
    process.exit(1);
  }
};

seed();
