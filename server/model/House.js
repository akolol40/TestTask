const moogoose = require('mongoose')
const { Schema } = moogoose
const usersDB = require('../mongo/usDb')

const Table = new Schema({
    addr: {
        type: String, 
    }, 
    userId: {
        type: String,
    }
},{versionKey: false})


module.exports = usersDB.model('Tabl', Table)