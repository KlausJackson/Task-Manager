const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/taskmanager').then(() => {
   console.log('Connected to database')
}).catch((error) => { console.log('Error:', error) })
