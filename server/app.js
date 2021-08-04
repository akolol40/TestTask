const express = require('express')
const Moongose = require('mongoose')
const dbConfig = require('./config/db')
const bodyParser = require('body-parser')
const passport = require('./passport/passport')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(passport.session())


app.use('/api', require('./routes/query.js'))






app.listen(3000)