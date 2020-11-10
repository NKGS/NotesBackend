const mongoose = require('mongoose')

const users = new mongoose.Schema({
    emailId: String,
    password: String
})

users.index({'$**': 'text'})

module.exports = mongoose.model('users', users)