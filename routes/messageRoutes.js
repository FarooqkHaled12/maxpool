const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/messageController');

router.route('/').get(ctrl.getMessages).post(ctrl.createMessage);
router.patch('/:id/read', ctrl.markRead);
router.delete('/:id', ctrl.deleteMessage);

module.exports = router;
