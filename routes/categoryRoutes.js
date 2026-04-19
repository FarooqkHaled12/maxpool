const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/categoryController');

router.route('/').get(ctrl.getCategories).post(ctrl.createCategory);
router.put('/:id',    ctrl.updateCategory);
router.delete('/:id', ctrl.deleteCategory);

module.exports = router;
