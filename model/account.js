const { Schema, model } = require('mongoose');

const AccountSchema = new Schema({
    username: String,
    usertag: String,
    posts: [String],
    comments: [String],
    followers: [String],
    following: [String]
})

const Account = model('Account', AccountSchema, 'accounts');

module.exports = Account;