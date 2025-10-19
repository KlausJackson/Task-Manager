function returnStatus(code, message, data, error, res) {
  res.status(code).send({ message: message, data: data, error: error })
}

module.exports = { returnStatus }
