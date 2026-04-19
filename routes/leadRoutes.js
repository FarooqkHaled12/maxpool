const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/leadController');

router.get('/',       ctrl.getLeads);
router.post('/',      ctrl.createLead);
router.patch('/:id',  ctrl.updateLeadStatus);
router.delete('/:id', ctrl.deleteLead);

module.exports = router;
