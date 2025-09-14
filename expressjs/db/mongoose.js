const mongoose = require('mongoose');
require('dotenv').config()

const mongoDB = process.env.MONGODB_URL || 'mongodb://localhost:27017/taskmanager';

mongoose.connect(mongoDB).then(() => {
   console.log('Connected to database')
}).catch((error) => { console.log('Error:', error) })
