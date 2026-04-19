const asyncHandler = require('../middleware/asyncHandler');
const Page         = require('../models/Page');

const DEFAULT_PAGES = [
  {
    slug: 'home', title: 'Home', titleAr: 'الرئيسية',
    metaTitle: 'Max Pool Egypt — Swimming Pool Equipment', metaTitleAr: 'ماكس بول مصر — معدات حمامات السباحة',
    metaDesc: "Egypt's leading swimming pool equipment supplier.", metaDescAr: 'المورد الرائد لمعدات حمامات السباحة في مصر.',
    sections: [
      { type: 'hero', order: 1, visible: true, content: {
        badge: 'European Standards. Egyptian Expertise.', badgeAr: 'معايير أوروبية. خبرة مصرية.',
        title: 'Your Technical Partners in Aquatic Success', titleAr: 'شركاؤك التقنيون في نجاح مشاريع المسابح',
        subtitle: 'Specialized providers of premium swimming pool equipment.', subtitleAr: 'مزودون متخصصون في معدات المسابح الفاخرة.',
        btn1Text: 'Explore Equipment', btn1TextAr: 'استكشف المعدات', btn1Link: 'products.html',
        btn2Text: 'Free Consultation', btn2TextAr: 'استشارة مجانية', btn2Link: 'contact.html'
      }},
      { type: 'features', order: 2, visible: true, content: {
        title: 'Why Choose Max Pool?', titleAr: 'لماذا تختار ماكس بول؟',
        subtitle: 'More than just suppliers — we are your partners in success.', subtitleAr: 'أكثر من مجرد موردين — نحن شركاؤك في النجاح.',
        items: [
          { icon: 'fa-globe', title: 'European Standards', titleAr: 'معايير أوروبية', text: 'We strictly adhere to the highest international and European quality standards.', textAr: 'نلتزم بأعلى معايير الجودة الدولية والأوروبية.' },
          { icon: 'fa-gears', title: 'Full-Service Operations', titleAr: 'خدمات متكاملة', text: 'From sourcing premium equipment to professional installation and meticulous maintenance.', textAr: 'من توريد المعدات الفاخرة إلى التركيب الاحترافي والصيانة الدقيقة.' },
          { icon: 'fa-user-shield', title: 'After-Sales Support', titleAr: 'دعم ما بعد البيع', text: 'Our dedicated technical experts ensure smooth operations long after installation.', textAr: 'يضمن خبراؤنا الفنيون سير العمليات بسلاسة بعد اكتمال التركيب.' }
        ]
      }},
      { type: 'cta', order: 3, visible: true, content: {
        title: 'Entrust Your Pool to the Experts', titleAr: 'ثق بخبرائنا لمسبحك',
        subtitle: 'Join Zamalek Sporting Club and leading resorts. Contact us today.', subtitleAr: 'انضم إلى نادي الزمالك الرياضي والمنتجعات الرائدة. تواصل معنا اليوم.',
        btnText: 'Contact Us — 01006205650', btnTextAr: 'تواصل معنا — 01006205650', btnLink: 'contact.html'
      }}
    ]
  },
  {
    slug: 'about', title: 'About Us', titleAr: 'من نحن',
    metaTitle: 'About Max Pool Egypt', metaTitleAr: 'عن ماكس بول مصر',
    metaDesc: "Egypt's most trusted swimming pool equipment company since 2009.", metaDescAr: 'شركة معدات حمامات السباحة الأكثر ثقة في مصر منذ 2009.',
    sections: [
      { type: 'about_hero', order: 1, visible: true, content: {
        eyebrow: 'About Max Pool', eyebrowAr: 'عن ماكس بول',
        title: "Egypt's Most Trusted Pool Partner", titleAr: 'الشريك الأكثر ثقة في مصر',
        subtitle: "Since 2009, we've been the technical backbone behind Egypt's finest pools.", subtitleAr: 'منذ 2009، كنا العمود الفقري التقني لأفضل مسابح مصر.',
        stats: [
          { value: '15+', label: 'Years Active', labelAr: 'سنة خبرة' },
          { value: '500+', label: 'Installations', labelAr: 'تركيب مكتمل' },
          { value: '50+', label: 'Elite Clients', labelAr: 'فندق ومنتجع' },
          { value: '5.0★', label: 'Google Rating', labelAr: 'تقييم جوجل' }
        ]
      }},
      { type: 'values', order: 2, visible: true, content: {
        eyebrow: 'What Drives Us', eyebrowAr: 'ما يحركنا',
        title: 'Our Core Values', titleAr: 'قيمنا الأساسية',
        items: [
          { icon: 'fa-medal', title: 'Quality First', titleAr: 'الجودة أولاً', text: 'Only certified, professional-grade products.', textAr: 'منتجات معتمدة واحترافية فقط.' },
          { icon: 'fa-microscope', title: 'Technical Expertise', titleAr: 'الخبرة التقنية', text: 'Deep knowledge of pool systems and water chemistry.', textAr: 'معرفة عميقة بأنظمة المسابح وكيمياء المياه.' },
          { icon: 'fa-truck-fast', title: 'Reliability', titleAr: 'الموثوقية', text: 'Consistent supply, fast delivery, dependable support.', textAr: 'توريد منتظم وتسليم سريع ودعم موثوق.' },
          { icon: 'fa-handshake', title: 'Customer Focus', titleAr: 'التركيز على العميل', text: "We succeed when our clients' pools perform perfectly.", textAr: 'ننجح عندما تعمل مسابح عملائنا بشكل مثالي.' },
          { icon: 'fa-lightbulb', title: 'Innovation', titleAr: 'الابتكار', text: 'Continuously sourcing the latest pool technologies.', textAr: 'نبحث باستمرار عن أحدث تقنيات المسابح.' },
          { icon: 'fa-scale-balanced', title: 'Integrity', titleAr: 'النزاهة', text: 'Honest advice, transparent pricing.', textAr: 'نصائح صادقة وأسعار شفافة.' }
        ]
      }}
    ]
  },
  {
    slug: 'services', title: 'Services', titleAr: 'الخدمات',
    metaTitle: 'Pool Services Egypt — Max Pool', metaTitleAr: 'خدمات حمامات السباحة — ماكس بول',
    metaDesc: 'Professional pool installation, maintenance, chemical treatment.', metaDescAr: 'تركيب وصيانة ومعالجة كيميائية احترافية لحمامات السباحة.',
    sections: [
      { type: 'services_hero', order: 1, visible: true, content: {
        eyebrow: 'Professional Services', eyebrowAr: 'خدمات احترافية',
        title: 'End-to-End Pool Services', titleAr: 'خدمات متكاملة للمسابح',
        subtitle: 'From initial consultation to professional installation, ongoing maintenance, and chemical treatment.', subtitleAr: 'من الاستشارة الأولية إلى التركيب الاحترافي والصيانة الدورية والمعالجة الكيميائية.'
      }},
      { type: 'services_list', order: 2, visible: true, content: {
        tag: 'What We Offer', tagAr: 'ما نقدمه',
        title: 'Our Full Range of Services', titleAr: 'نطاق خدماتنا الكامل',
        items: [
          { num: '01', color: '#0077b6', icon: 'fa-boxes-stacked', title: 'Equipment Supply', titleAr: 'توريد المعدات', text: 'Professional-grade pumps, sand filters, LED lighting.', textAr: 'طلمبات وفلاتر رمل وإضاءة LED.' },
          { num: '02', color: '#0d7a3e', icon: 'fa-screwdriver-wrench', title: 'Installation & Setup', titleAr: 'التركيب والتشغيل', text: 'Full installation by certified pool technicians.', textAr: 'تركيب كامل بواسطة فنيين معتمدين.' },
          { num: '03', color: '#7c3aed', icon: 'fa-calendar-check', title: 'Maintenance Contracts', titleAr: 'عقود الصيانة', text: 'Scheduled maintenance for commercial and residential pools.', textAr: 'صيانة دورية للمسابح التجارية والسكنية.' },
          { num: '04', color: '#d97706', icon: 'fa-flask', title: 'Chemical Treatment', titleAr: 'المعالجة الكيميائية', text: 'Complete water chemistry management.', textAr: 'إدارة كاملة لكيمياء المياه.' },
          { num: '05', color: '#dc2626', icon: 'fa-headset', title: 'Technical Consultation', titleAr: 'الاستشارة التقنية', text: 'Expert advice on equipment selection.', textAr: 'نصائح خبراء في اختيار المعدات.' },
          { num: '06', color: '#0891b2', icon: 'fa-rotate', title: 'Renovation & Upgrades', titleAr: 'التجديد والترقيات', text: 'Modernize aging pool systems.', textAr: 'تحديث أنظمة المسابح القديمة.' }
        ]
      }}
    ]
  },
  {
    slug: 'contact', title: 'Contact Us', titleAr: 'تواصل معنا',
    metaTitle: 'Contact Max Pool Egypt', metaTitleAr: 'تواصل مع ماكس بول مصر',
    metaDesc: 'Contact Max Pool Egypt for pool equipment and services.', metaDescAr: 'تواصل مع ماكس بول مصر للحصول على معدات وخدمات حمامات السباحة.',
    sections: [
      { type: 'contact_hero', order: 1, visible: true, content: {
        title: 'Get In Touch', titleAr: 'تواصل معنا',
        subtitle: 'Whether you need a premium filtration system or maintenance support, our technical experts are ready.', subtitleAr: 'سواء كنت تحتاج إلى نظام ترشيح فاخر أو دعم صيانة، فريقنا الفني جاهز.'
      }},
      { type: 'contact_info', order: 2, visible: true, content: {
        address: 'Pearl Tower, Al Marioutia Axis, Al Haram, Giza', addressAr: 'برج اللؤلؤة، محور المريوطية، الهرم، الجيزة',
        phone: '01006205650', whatsapp: '201006205650',
        hours: 'Sat–Thu 9AM–6PM', hoursAr: 'السبت–الخميس 9 صباحاً–6 مساءً',
        rating: '5.0', reviewCount: '7'
      }}
    ]
  }
];

exports.getPages = asyncHandler(async (_req, res) => {
  const pages = await Page.find({}).select('-sections').sort({ slug: 1 });
  res.json({ success: true, data: pages });
});

exports.getPage = asyncHandler(async (req, res) => {
  let page = await Page.findOne({ slug: req.params.slug });
  if (!page) {
    const def = DEFAULT_PAGES.find(p => p.slug === req.params.slug);
    if (def) { page = await Page.create(def); }
    else { return res.status(404).json({ success: false, error: 'Page not found' }); }
  }
  res.json({ success: true, data: page });
});

exports.getPageById = asyncHandler(async (req, res) => {
  const page = await Page.findById(req.params.id);
  if (!page) return res.status(404).json({ success: false, error: 'Page not found' });
  res.json({ success: true, data: page });
});

exports.createPage = asyncHandler(async (req, res) => {
  const page = await Page.create(req.body);
  res.status(201).json({ success: true, data: page });
});

exports.updatePage = asyncHandler(async (req, res) => {
  const page = await Page.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!page) return res.status(404).json({ success: false, error: 'Page not found' });
  res.json({ success: true, data: page });
});

exports.updateSection = asyncHandler(async (req, res) => {
  const { id, sectionType } = req.params;
  const page = await Page.findById(id);
  if (!page) return res.status(404).json({ success: false, error: 'Page not found' });
  const idx = page.sections.findIndex(s => s.type === sectionType);
  if (idx === -1) { page.sections.push({ type: sectionType, order: page.sections.length + 1, content: req.body }); }
  else { page.sections[idx].content = { ...page.sections[idx].content, ...req.body }; }
  await page.save();
  res.json({ success: true, data: page });
});

exports.deletePage = asyncHandler(async (req, res) => {
  const page = await Page.findByIdAndDelete(req.params.id);
  if (!page) return res.status(404).json({ success: false, error: 'Page not found' });
  res.json({ success: true, message: 'Page deleted' });
});

exports.seedPages = asyncHandler(async (_req, res) => {
  await Page.deleteMany({});
  const pages = await Page.insertMany(DEFAULT_PAGES);
  res.json({ success: true, message: `Seeded ${pages.length} pages`, data: pages.map(p => p.slug) });
});
