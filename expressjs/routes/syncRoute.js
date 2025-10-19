const router = require('express').Router()
const syncController = require('../controllers/syncController')

router.route('/').post(syncController.syncData) // post /sync

module.exports = router
