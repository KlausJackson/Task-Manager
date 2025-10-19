const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { returnStatus } = require('../helpers/helpers')

async function auth(req, res, next) {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_SECRET) // check signature, expiry

    const user = await User.findOne({ _id: decoded._id })
    if (!user) throw new Error('User not found.')
    req.user = user
    next()
  } catch (e) {
    returnStatus(401, 'Unauthorized', null, e.message, res)
  }
}

module.exports = auth
