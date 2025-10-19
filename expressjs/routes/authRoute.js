const router = require('express').Router()
const authController = require('../controllers/authController')
const auth = require('../middlewares/auth')

router.post('/register', authController.register) // POST /auth/register
router.post('/login', authController.login) // POST /auth/login
router.delete('/me', auth, authController.deleteMe) // DELETE /auth/me

module.exports = router
