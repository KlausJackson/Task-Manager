const User = require('../models/User')
const { returnStatus } = require('../helpers/helpers')


async function register(req, res) {
	try {
		const user = new User(req.body)
		await user.save()
		const token = await user.generateToken()
		returnStatus(201, 'User registered successfully.', token, null, res)
	} catch (e) {
		returnStatus(400, e.message, null, null, res)
	}
}


async function login(req, res) {
	try {
		const { username, password } = req.body
		const user = await User.findByCredentials(username, password)
		const token = await user.generateToken()
		returnStatus(200, 'Login successful', { user, token }, null, res)
	} catch (e) {
		returnStatus(400, 'Unable to login. Invalid credentials.', null, res);
	}
}


const deleteMe = async (req, res) => {
	try {
		await req.user.deleteOne()
		res.send(req.user)
	} catch (e) {
		returnStatus(500, 'Error deleting user.', null, e.message, res)
	}
}


module.exports = {
	register,
	login,
	deleteMe
}
