const User = require('../models/User')
const { returnStatus } = require('../helpers/helpers')


async function register(req, res) {
	try {
		const user = new User(req.body)
		const existingUser = await User.findOne({ username: user.username })
		if (existingUser) {
			return returnStatus(400, 'Username already exists.', null, null, res)
		}
		
		await user.save()
		const token = await user.generateToken()
		returnStatus(201, 'User registered successfully.', token, null, res)
	} catch (e) {
		console.log(e)
		returnStatus(400, e.message, null, null, res)
	}
}


async function login(req, res) {
	try {
		const { username, password } = req.body
		const user = await User.findByCredentials(username, password)
		const token = await user.generateToken()
		returnStatus(200, 'Login successful', token, null, res)
	} catch (e) {
		returnStatus(400, 'Unable to login. Invalid credentials.', null, e.message, res);
	}
}


async function deleteMe(req, res) {
	try {
		await req.user.deleteOne()
		returnStatus(200, 'User deleted successfully.', null, null, res)
	} catch (e) {
		returnStatus(500, 'Error deleting user.', null, e.message, res)
	}
}


module.exports = {
	register,
	login,
	deleteMe
}
