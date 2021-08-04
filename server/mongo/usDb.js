const uri = require('../config/db')
const mongoose = require('mongoose')

mongoose.connect(uri.db.users, {useNewUrlParser: true, useUnifiedTopology: true})

module.exports =  mongoose