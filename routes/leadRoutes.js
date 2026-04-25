const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/leadController');
const { protect } = require('../middleware/auth');

// IMPORTANT: /stats MUST be registered before /:id
// Otherwise Express treats 'stats' as an :id parameter
router.get('/stats', protect, ctrl.getLeadStats);
router.get('/',      protect, ctrl.getLeads);
router.get('/:id',   protect, ctrl.getLead);
router.post('/',             ctrl.createLead);   // public — no auth required
router.patch('/:id', protect, ctrl.updateLeadStatus);
router.delete('/:id',protect, ctrl.deleteLead);

module.exports = router;
