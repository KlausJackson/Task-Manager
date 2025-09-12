const express = require('express')
require('./db/mongoose')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000


const authRoute = require('./routes/authRoute')
const noteRouter = require('./routes/noteRoute')
const tagRouter = require('./routes/tagRoute')
const syncRouter = require('./routes/syncRoute')
const auth = require('./middlewares/auth')


app.use(express.json())
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/notes', auth, noteRouter)
app.use('/api/v1/tags', auth, tagRouter)
app.use('/api/v1/sync', auth, syncRouter)


app.listen(port, () => {
	console.log(`Server is up on port ${port}`)
})
