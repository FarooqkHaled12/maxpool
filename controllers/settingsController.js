const asyncHandler  = require('../middleware/asyncHandler');
const SiteSettings  = require('../models/SiteSettings');

const DEFAULTS = [
  { key: 'site_name',       value: 'Max Pool Egypt',          group: 'general',  label: 'Site Name',              type: 'text' },
  { key: 'site_name_ar',    value: 'ماكس بول مصر',            group: 'general',  label: 'Site Name (AR)',         type: 'text' },
  { key: 'phone',           value: '01006205650',             group: 'contact',  label: 'Phone Number',           type: 'phone' },
  { key: 'address_en',      value: 'Pearl Tower, Al Marioutia Axis, Al Haram, Giza', group: 'contact', label: 'Address (EN)', type: 'text' },
  { key: 'address_ar',      value: 'برج اللؤلؤة، محور المريوطية، الهرم، الجيزة',    group: 'contact', label: 'Address (AR)', type: 'text' },
  { key: 'email',           value: '',                        group: 'contact',  label: 'Email',                  type: 'email' },
  { key: 'working_hours',   value: 'Sat–Thu 9AM–6PM',        group: 'contact',  label: 'Working Hours',          type: 'text' },
  { key: 'facebook_url',    value: 'https://www.facebook.com/maxpoool', group: 'social', label: 'Facebook URL',   type: 'url' },
  { key: 'whatsapp',        value: '201006205650',            group: 'social',   label: 'WhatsApp Number',        type: 'phone' },
  { key: 'hero_title_en',   value: 'Your Technical Partners in Aquatic Success', group: 'hero', label: 'Hero Title (EN)', type: 'text' },
  { key: 'hero_title_ar',   value: 'شركاؤك التقنيون في نجاح مشاريع المسابح',    group: 'hero', label: 'Hero Title (AR)', type: 'text' },
  { key: 'hero_sub_en',     value: 'Specialized providers of premium swimming pool equipment.', group: 'hero', label: 'Hero Subtitle (EN)', type: 'textarea' },
  { key: 'hero_sub_ar',     value: 'مزودون متخصصون في معدات المسابح الفاخرة.',  group: 'hero', label: 'Hero Subtitle (AR)', type: 'textarea' },
  { key: 'about_title_en',  value: 'Partners in Your Aquatic Success', group: 'about', label: 'About Title (EN)', type: 'text' },
  { key: 'about_title_ar',  value: 'شركاؤك في النجاح',                 group: 'about', label: 'About Title (AR)', type: 'text' },
  { key: 'about_p1_en',     value: 'At Max Pool, we consider ourselves more than just suppliers.', group: 'about', label: 'About Para 1 (EN)', type: 'textarea' },
  { key: 'about_p1_ar',     value: 'في ماكس بول، نعتبر أنفسنا أكثر من مجرد موردين.',             group: 'about', label: 'About Para 1 (AR)', type: 'textarea' },
  { key: 'founded_year',    value: '2009',                    group: 'about',    label: 'Founded Year',           type: 'text' },
  { key: 'projects_count',  value: '500+',                   group: 'about',    label: 'Projects Count',         type: 'text' },
  { key: 'clients_count',   value: '50+',                    group: 'about',    label: 'Elite Clients',          type: 'text' },
  { key: 'google_rating',   value: '5.0',                    group: 'about',    label: 'Google Rating',          type: 'text' },
  { key: 'meta_title_en',   value: 'Max Pool Egypt — Swimming Pool Equipment', group: 'seo', label: 'Meta Title (EN)', type: 'text' },
  { key: 'meta_title_ar',   value: 'ماكس بول مصر — معدات حمامات السباحة',    group: 'seo', label: 'Meta Title (AR)', type: 'text' },
  { key: 'meta_desc_en',    value: "Egypt's leading swimming pool equipment supplier.", group: 'seo', label: 'Meta Description (EN)', type: 'textarea' },
  { key: 'meta_desc_ar',    value: 'المورد الرائد لمعدات حمامات السباحة في مصر.',      group: 'seo', label: 'Meta Description (AR)', type: 'textarea' },
  // Pricing — Pool Construction
  { key: 'price_skimmer_home_min',   value: '150000', group: 'pricing', label: 'Skimmer Home Pool — Min (EGP)', type: 'number' },
  { key: 'price_skimmer_home_max',   value: '250000', group: 'pricing', label: 'Skimmer Home Pool — Max (EGP)', type: 'number' },
  { key: 'price_skimmer_villa_min',  value: '250000', group: 'pricing', label: 'Skimmer Villa Pool — Min (EGP)', type: 'number' },
  { key: 'price_skimmer_villa_max',  value: '400000', group: 'pricing', label: 'Skimmer Villa Pool — Max (EGP)', type: 'number' },
  { key: 'price_overflow_villa_min', value: '400000', group: 'pricing', label: 'Overflow Villa Pool — Min (EGP)', type: 'number' },
  { key: 'price_overflow_villa_max', value: '650000', group: 'pricing', label: 'Overflow Villa Pool — Max (EGP)', type: 'number' },
  { key: 'price_commercial_min',     value: '600000', group: 'pricing', label: 'Commercial Hotel Pool — Min (EGP)', type: 'number' },
  { key: 'price_commercial_max',     value: '1200000', group: 'pricing', label: 'Commercial Hotel Pool — Max (EGP)', type: 'number' },
  { key: 'price_fiberglass_min',     value: '120000', group: 'pricing', label: 'Fiberglass Pool — Min (EGP)', type: 'number' },
  { key: 'price_fiberglass_max',     value: '200000', group: 'pricing', label: 'Fiberglass Pool — Max (EGP)', type: 'number' },
];

exports.getSettings = asyncHandler(async (_req, res) => {
  let settings = await SiteSettings.find({});
  if (settings.length === 0) {
    await SiteSettings.insertMany(DEFAULTS);
    settings = await SiteSettings.find({});
  }
  // Upsert any missing defaults (e.g. new pricing keys added later)
  const existingKeys = new Set(settings.map(s => s.key));
  const missing = DEFAULTS.filter(d => !existingKeys.has(d.key));
  if (missing.length > 0) {
    await SiteSettings.insertMany(missing);
    settings = await SiteSettings.find({});
  }
  const map = {};
  settings.forEach(s => { map[s.key] = s.value; });
  res.json({ success: true, data: map });
});

exports.getSettingsFull = asyncHandler(async (_req, res) => {
  let settings = await SiteSettings.find({}).sort({ group: 1, key: 1 });
  if (settings.length === 0) {
    await SiteSettings.insertMany(DEFAULTS);
    settings = await SiteSettings.find({}).sort({ group: 1, key: 1 });
  }
  res.json({ success: true, data: settings });
});

exports.updateSettings = asyncHandler(async (req, res) => {
  const updates = req.body;
  if (!updates || typeof updates !== 'object') {
    return res.status(400).json({ success: false, error: 'Invalid payload' });
  }
  const ops = Object.entries(updates).map(([key, value]) => ({
    updateOne: { filter: { key }, update: { $set: { value } }, upsert: true }
  }));
  await SiteSettings.bulkWrite(ops);
  res.json({ success: true, message: 'Settings updated' });
});

exports.updateSetting = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  const setting = await SiteSettings.findOneAndUpdate(
    { key }, { $set: { value } }, { new: true, upsert: true }
  );
  res.json({ success: true, data: setting });
});
