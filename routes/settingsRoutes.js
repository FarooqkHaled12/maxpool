const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/settingsController');

router.get('/',     ctrl.getSettingsFull);
router.put('/',     ctrl.updateSettings);
router.put('/:key', ctrl.updateSetting);

module.exports = router;
