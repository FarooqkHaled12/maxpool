require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Product  = require('../models/Product');
const Category = require('../models/Category');
const Admin    = require('../models/Admin');

// Products data embedded directly (no external file dependency)
const rawProducts = [
  { title: 'Hayward Super Pump', description: 'Exceptionally quiet and highly efficient American pump, favored for luxury residential setups.', category: 'cat-pumps', brand: 'brand-hayward', image: 'assets/images/61Hnd9NHhSL._AC_SL1500_.jpg', brandName: 'Hayward' },
  { title: 'AstralPool Cantabric Filter', description: 'Premium Spanish fiberglass filter known for longevity in commercial applications.', category: 'cat-filters', brand: 'brand-astral', image: 'assets/images/81Iws8JVg3L._AC_SL1500_.jpg', brandName: 'AstralPool' },
  { title: 'Aqua Motor Pump', description: 'Italian engineered motor pump for reliable daily circulation in oversized pools and resorts.', category: 'cat-pumps', brand: 'brand-aqua', image: 'assets/images/81bnYR7YntL._AC_SL1500_.jpg', brandName: 'Aqua' },
  { title: 'Max Pool Sand Filter 600mm', description: 'Exclusive robust fiberglass sand filter operating under high pressure for superior water clarity.', category: 'cat-filters', brand: 'brand-maxpool', image: 'assets/images/WhatsApp Image 2026-01-06 at 12.26.48 PM.jpeg', brandName: 'Max Pool' },
  { title: 'Underwater LED LumiPlus', description: 'High-efficiency LED lighting creating brilliant ambiance inside your swimming pool at night.', category: 'cat-lights', brand: 'brand-astral', image: 'assets/images/520276190_1298604181995169_2797115034299634446_n.jpg', brandName: 'AstralPool' },
  { title: 'Hayward ColorLogic', description: 'Vibrant, automated color-changing LED pool and spa lights.', category: 'cat-lights', brand: 'brand-hayward', image: 'assets/images/527821586_1312263843962536_8274387280723726163_n.jpg', brandName: 'Hayward' },
  { title: 'Stainless Steel Ladder', description: 'Grade 316 stainless steel ladder, immune to heavy chlorination and oxidation.', category: 'cat-ladders', brand: 'brand-astral', image: 'assets/images/527922419_1312263943962526_999507048525190661_n.jpg', brandName: 'AstralPool' },
  { title: 'Premium Cleaning Kit', description: 'Complete set of telescopic poles, brushes, deep nets, and vacuum heads for manual cleaning.', category: 'cat-cleaners', brand: 'brand-maxpool', image: 'assets/images/528064106_1312263847295869_6671952987321461698_n.jpg', brandName: 'Max Pool' },
  { title: 'Chlorine Shock Treatment', description: 'Pure, heavy-duty chlorination granules dedicated to killing algae and rapid bacteria oxidation.', category: 'cat-chemicals', brand: 'brand-maxpool', image: 'assets/images/alga.jpg', brandName: 'Max Pool' }
];

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
