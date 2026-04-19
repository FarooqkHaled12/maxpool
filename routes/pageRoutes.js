const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/pageController');

router.get('/',          ctrl.getPages);
router.get('/:id',       ctrl.getPageById);
router.post('/',         ctrl.createPage);
router.post('/seed/all', ctrl.seedPages);
router.put('/:id',       ctrl.updatePage);
router.put('/:id/section/:sectionType', ctrl.updateSection);
router.delete('/:id',    ctrl.deletePage);

module.exports = router;
