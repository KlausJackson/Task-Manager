const router = require('express').Router();
const syncController = require('../controllers/syncController');

router.route('/').get(syncController.syncData);        // GET /sync

module.exports = router;