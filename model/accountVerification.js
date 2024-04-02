const { Schema, model } = require('mongoose');

const AccountVerificationSchema = new Schema({
    username: String,
    displayName: String,
    email: String,
    bio: String
})

const AccountVerification = model('AccountVerification', AccountVerificationSchema, 'accountTest');

module.exports = AccountVerification;