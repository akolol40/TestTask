const moogoose = require('mongoose')
const { Schema } = moogoose
const usersDB = require('../mongo/usDb')

const User = new Schema({
    email: {
        type: String, 
    }, 
    pwd: {
        type: String,
        default: 'kristik'
    },
    fio: {
        type: String,
    },
    phone: {
        type: Number
    },
},{versionKey: false})


module.exports = usersDB.model('People', User)