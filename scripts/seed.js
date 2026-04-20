require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
require('dns').setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
const Product  = require('../models/Product');
const Category = require('../models/Category');
const Admin    = require('../models/Admin');

const rawProducts = [
  { title: 'Hayward Super Pump',          description: 'Exceptionally quiet and highly efficient American pump, favored for luxury residential setups.',                   category: 'cat-pumps',     brand: 'brand-hayward',  brandName: 'Hayward',    image: '/images/hayward-super-pump.jpg',              featured: true  },
  { title: 'Aqua Motor Pump',             description: 'Italian engineered motor pump for reliable daily circulation in oversized pools and resorts.',                     category: 'cat-pumps',     brand: 'brand-aqua',     brandName: 'Aqua',       image: '/images/aqua-motor-pump.jpg',                 featured: true  },
  { title: 'AstralPool Pump Unit',        description: 'High-performance Spanish pump unit designed for continuous operation in commercial pools.',                        category: 'cat-pumps',     brand: 'brand-astral',   brandName: 'AstralPool', image: '/images/astralpool-pump-unit.jpg',            featured: false },
  { title: 'Pool Installation - Villa',   description: 'Complete pool equipment installation for luxury villa - pump, filter, lighting, and fittings.',                   category: 'cat-pumps',     brand: 'brand-maxpool',  brandName: 'Max Pool',   image: '/images/pool-project-luxury-villa.jpg',       featured: false },
  { title: 'Pool Project - Sharm',        description: 'Commercial pool equipment setup for a five-star resort in Sharm El Sheikh.',                                      category: 'cat-pumps',     brand: 'brand-maxpool',  brandName: 'Max Pool',   image: '/images/pool-project-sharm.jpg',              featured: false },
  { title: 'Pool Project - Resort',       description: 'Large-scale pool equipment supply and installation for a resort complex.',                                         category: 'cat-pumps',     brand: 'brand-maxpool',  brandName: 'Max Pool',   image: '/images/pool-project-resort.jpg',             featured: false },
  { title: 'AstralPool Cantabric Filter', description: 'Premium Spanish fiberglass filter known for longevity in commercial applications.',                                category: 'cat-filters',   brand: 'brand-astral',   brandName: 'AstralPool', image: '/images/astralpool-cantabric-filter.jpg',     featured: true  },
  { title: 'Max Pool Sand Filter 600mm',  description: 'Exclusive robust fiberglass sand filter operating under high pressure for superior water clarity.',                category: 'cat-filters',   brand: 'brand-maxpool',  brandName: 'Max Pool',   image: '/images/max-pool-sand-filter-600mm.jpg',      featured: true  },
  { title: 'AstralPool Side-Mount Filter',description: 'Side-mount sand filter with large filtration surface for high-flow commercial installations.',                    category: 'cat-filters',   brand: 'brand-astral',   brandName: 'AstralPool', image: '/images/astralpool-side-mount-filter.jpg',    featured: false },
  { title: 'AstralPool Top-Mount Filter', description: 'Compact top-mount filter ideal for residential pools with limited equipment room.',                                category: 'cat-filters',   brand: 'brand-astral',   brandName: 'AstralPool', image: '/images/astralpool-top-mount-filter.jpg',     featured: false },
  { title: 'AstralPool Complete System',  description: 'Full AstralPool filtration and circulation system - pump, filter, and fittings bundle.',                          category: 'cat-filters',   brand: 'brand-astral',   brandName: 'AstralPool', image: '/images/astralpool-complete-system.jpg',      featured: false },
  { title: 'AstralPool Equipment Package',description: 'Turnkey AstralPool equipment package for new pool installations and renovations.',                                 category: 'cat-filters',   brand: 'brand-astral',   brandName: 'AstralPool', image: '/images/astralpool-equipment-package.png',    featured: false },
  { title: 'Pool Project - North Coast',  description: 'Full filtration system installation for a North Coast resort pool.',                                               category: 'cat-filters',   brand: 'brand-maxpool',  brandName: 'Max Pool',   image: '/images/pool-project-north-coast.jpg',        featured: false },
  { title: 'Pool Project - Zamalek Club', description: 'Full overhaul of filtration and circulation systems at Zamalek Sporting Club.',                                   category: 'cat-filters',   brand: 'brand-maxpool',  brandName: 'Max Pool',   image: '/images/pool-project-zamalek-club.jpg',       featured: false },
  { title: 'Underwater LED LumiPlus',     description: 'High-efficiency LED lighting creating brilliant ambiance inside your swimming pool at night.',                     category: 'cat-lights',    brand: 'brand-astral',   brandName: 'AstralPool', image: '/images/underwater-led-lumiplus.jpg',         featured: true  },
  { title: 'Hayward ColorLogic LED',      description: 'Vibrant, automated color-changing LED pool and spa lights with remote control.',                                   category: 'cat-lights',    brand: 'brand-hayward',  brandName: 'Hayward',    image: '/images/hayward-colorlogic-led.jpg',          featured: false },
  { title: 'Underwater Spotlight Halogen',description: 'Classic halogen underwater spotlight providing warm white illumination for pool interiors.',                       category: 'cat-lights',    brand: 'brand-maxpool',  brandName: 'Max Pool',   image: '/images/underwater-spotlight-halogen.jpg',    featured: false },
  { title: 'Surface-Mount Pool Spotlight',description: 'Surface-mount LED spotlight for pool walls and steps, easy retrofit installation.',                                category: 'cat-lights',    brand: 'brand-maxpool',  brandName: 'Max Pool',   image: '/images/surface-mount-pool-spotlight.jpg',    featured: false },
  { title: 'Surface-Mount Spotlight Pro', description: 'Heavy-duty surface-mount spotlight with stainless steel housing for long-term durability.',                       category: 'cat-lights',    brand: 'brand-maxpool',  brandName: 'Max Pool',   image: '/images/surface-mount-spotlight-pro.jpg',     featured: false },
  { title: 'Pool Project Luxury Villa',   description: 'Premium pool equipment installation for a luxury villa with overflow system.',                                     category: 'cat-lights',    brand: 'brand-maxpool',  brandName: 'Max Pool',   image: '/images/pool-project-luxury-villa.jpg',       featured: false },
  { title: 'Stainless Steel Ladder',      description: 'Grade 316 stainless steel ladder, immune to heavy chlorination and oxidation.',                                   category: 'cat-ladders',   brand: 'brand-astral',   brandName: 'AstralPool', image: '/images/stainless-steel-ladder.jpg',          featured: false },
  { title: 'Pool Entry Ladder 3 Step',    description: 'Three-step stainless steel entry ladder with anti-slip treads for safe pool access.',                             category: 'cat-ladders',   brand: 'brand-maxpool',  brandName: 'Max Pool',   image: '/images/pool-entry-ladder-3-step.jpg',        featured: false },
  { title: 'Premium Cleaning Kit',        description: 'Complete set of telescopic poles, brushes, deep nets, and vacuum heads for manual cleaning.',                     category: 'cat-cleaners',  brand: 'brand-maxpool',  brandName: 'Max Pool',   image: '/images/premium-cleaning-kit.jpg',            featured: false },
  { title: 'Pool Brush and Net Set',      description: 'Professional-grade wall brush and leaf net set for daily pool maintenance.',                                       category: 'cat-cleaners',  brand: 'brand-maxpool',  brandName: 'Max Pool',   image: '/images/pool-brush-and-net-set.jpg',          featured: false },
  { title: 'Chlorine Shock Treatment',    description: 'Pure, heavy-duty chlorination granules dedicated to killing algae and rapid bacteria oxidation.',                  category: 'cat-chemicals', brand: 'brand-maxpool',  brandName: 'Max Pool',   image: '/images/chlorine-shock-treatment.jpg',        featured: false },
  { title: 'Pool Inlet Fitting Eyeball',  description: 'Adjustable eyeball return inlet fitting for directing water flow inside the pool.',                                category: 'cat-fittings',  brand: 'brand-astral',   brandName: 'AstralPool', image: '/images/pool-inlet-fitting-eyeball.jpg',      featured: false },
  { title: 'Flexible Pool Hose',          description: 'Heavy-duty flexible hose for connecting pool equipment - pressure and UV resistant.',                              category: 'cat-fittings',  brand: 'brand-maxpool',  brandName: 'Max Pool',   image: '/images/flexible-pool-hose.jpg',              featured: false },
  { title: 'Pool Grating Panel',          description: 'Anti-slip ABS grating panel for pool surrounds, overflow channels, and wet areas.',                               category: 'cat-fittings',  brand: 'brand-maxpool',  brandName: 'Max Pool',   image: '/images/pool-grating-panel.jpg',              featured: false },
  { title: 'Pool Accessory Set A',        description: 'Complete pool accessory bundle including skimmer basket, wall fittings, and drain cover.',                        category: 'cat-fittings',  brand: 'brand-astral',   brandName: 'AstralPool', image: '/images/pool-accessory-set-a.jpg',            featured: false },
  { title: 'Pool Accessory Set B',        description: 'Supplementary accessory kit with replacement parts for standard pool installations.',                              category: 'cat-fittings',  brand: 'brand-astral',   brandName: 'AstralPool', image: '/images/pool-accessory-set-b.jpg',            featured: false },
  { title: 'Pool Accessory Set C',        description: 'Overflow pool accessory set including gutter fittings and surface skimmer components.',                           category: 'cat-fittings',  brand: 'brand-astral',   brandName: 'AstralPool', image: '/images/pool-accessory-set-c.jpg',            featured: false },
  { title: 'Pool Accessory Set D',        description: 'Maintenance accessory kit with vacuum plate, hose connectors, and brush adapters.',                               category: 'cat-fittings',  brand: 'brand-astral',   brandName: 'AstralPool', image: '/images/pool-accessory-set-d.jpg',            featured: false },
  { title: 'AstralPool Pump Package',     description: 'Complete AstralPool pump package with pre-filter basket and mounting hardware.',                                   category: 'cat-pumps',     brand: 'brand-astral',   brandName: 'AstralPool', image: '/images/astralpool-pump-package.jpg',         featured: false },
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
    console.log('[Seed] Inserted ' + CATEGORIES.length + ' categories');
    const products = rawProducts.map((p, i) => {
      const name = p.title.trim();
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/, '') + '-' + (i + 1);
      return { name, slug, description: p.description, category: p.category, brand: p.brand, brandName: p.brandName, images: [p.image], featured: p.featured };
    });
    await Product.insertMany(products);
    console.log('[Seed] Inserted ' + products.length + ' products');
    await Admin.deleteMany();
    await Admin.create({ email: process.env.ADMIN_EMAIL || 'admin@maxpool.com', password: process.env.ADMIN_PASSWORD || 'Admin@123456', name: 'Max Pool Admin' });
    console.log('[Seed] Admin created: ' + (process.env.ADMIN_EMAIL || 'admin@maxpool.com'));
    console.log('[Seed] Done!');
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error:', err.message);
    process.exit(1);
  }
};

seed();

