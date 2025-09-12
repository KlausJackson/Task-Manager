const express = require('express')
require('./db/mongoose')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000


const authRoute = require('./routers/authRoute')
const noteRouter = require('./routers/noteRoute')
const tagRouter = require('./routers/tagRoute')
const syncRouter = require('./routers/syncRoute')
const auth = require('./middlewares/auth')


app.use(express.json())
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/notes', auth, noteRouter)
app.use('/api/v1/tags', auth, tagRouter)
app.use('/api/v1/sync', auth, syncRouter)


app.listen(port, () => {
	console.log(`Server is up on port ${port}`)
})
