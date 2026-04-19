const asyncHandler = require('../middleware/asyncHandler');
const Lead         = require('../models/Lead');

exports.getLeads = asyncHandler(async (_req, res) => {
  const leads = await Lead.find({}).sort({ createdAt: -1 });
  res.json({ success: true, data: leads, count: leads.length });
});

exports.createLead = asyncHandler(async (req, res) => {
  const { name, phone, email, message, source } = req.body;
  if (!name || !phone) return res.status(400).json({ success: false, error: 'name and phone are required' });
  const lead = await Lead.create({ name, phone, email: email || '', message: message || '', source: source || 'website' });
  res.status(201).json({ success: true, data: lead });
});

exports.updateLeadStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;
  const lead = await Lead.findByIdAndUpdate(req.params.id, { status, notes }, { new: true });
  if (!lead) return res.status(404).json({ success: false, error: 'Lead not found' });
  res.json({ success: true, data: lead });
});

exports.deleteLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) return res.status(404).json({ success: false, error: 'Lead not found' });
  res.json({ success: true, message: 'Lead deleted' });
});
