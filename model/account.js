const { Schema, model, default: mongoose } = require('mongoose');

const AccountSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    username: String,
    usertag: String,
    posts: [String],
    comments: [String],
    followers: [String],
    following: [String]
})

const Account = model('Account', AccountSchema, 'accounts');

module.exports = Account;