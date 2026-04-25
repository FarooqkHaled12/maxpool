const asyncHandler = require('../middleware/asyncHandler');
const Lead         = require('../models/Lead');

// GET /api/leads — admin only
exports.getLeads = asyncHandler(async (_req, res) => {
  const leads = await Lead.find({}).sort({ createdAt: -1 });
  res.json({ success: true, data: leads, count: leads.length });
});

// GET /api/leads/stats — admin only (must be registered BEFORE /:id in routes)
exports.getLeadStats = asyncHandler(async (_req, res) => {
  const now        = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart  = new Date(now - 7 * 24 * 60 * 60 * 1000);

  const [total, bySourceArr, byStatusArr, todayLeads, thisWeekLeads] = await Promise.all([
    Lead.countDocuments(),
    Lead.aggregate([{ $group: { _id: '$source', count: { $sum: 1 } } }]),
    Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Lead.countDocuments({ createdAt: { $gte: todayStart } }),
    Lead.countDocuments({ createdAt: { $gte: weekStart } }),
  ]);

  const toObj = (arr) => arr.reduce((acc, { _id, count }) => {
    if (_id) acc[_id] = count;
    return acc;
  }, {});

  res.json({
    success: true,
    data: {
      totalLeads:    total,
      bySource:      toObj(bySourceArr),
      byStatus:      toObj(byStatusArr),
      todayLeads,
      thisWeekLeads,
    }
  });
});

// GET /api/leads/:id — admin only
exports.getLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) return res.status(404).json({ success: false, error: 'Lead not found' });
  res.json({ success: true, data: lead });
});

// POST /api/leads — public
exports.createLead = asyncHandler(async (req, res) => {
  const { name, phone, email, message, source, productId, page } = req.body;
  if (!name || !phone) return res.status(400).json({ success: false, error: 'name and phone are required' });
  const lead = await Lead.create({
    name,
    phone,
    email:     email     || '',
    message:   message   || '',
    source:    source    || 'website',
    productId: productId || null,
    page:      page      || '',
  });
  res.status(201).json({ success: true, data: lead });
});

// PATCH /api/leads/:id — admin only
exports.updateLeadStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;
  const lead = await Lead.findByIdAndUpdate(req.params.id, { status, notes }, { new: true });
  if (!lead) return res.status(404).json({ success: false, error: 'Lead not found' });
  res.json({ success: true, data: lead });
});

// DELETE /api/leads/:id — admin only
exports.deleteLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) return res.status(404).json({ success: false, error: 'Lead not found' });
  res.json({ success: true, message: 'Lead deleted' });
});
