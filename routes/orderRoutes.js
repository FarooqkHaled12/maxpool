const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/orderController');

router.route('/').get(ctrl.getOrders).post(ctrl.createOrder);
router.patch('/:id/status', ctrl.updateStatus);
router.delete('/:id', ctrl.deleteOrder);

module.exports = router;
