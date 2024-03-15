const { Schema, model } = require('mongoose');

const AccountInfoUpdateSchema = new Schema({
    username: String,
    displayName: String,
    email: String
})

const AccountInfoUpdate = model('AccountInfoUpdate', AccountInfoUpdateSchema, 'accountTest');

module.exports = AccountInfoUpdate;