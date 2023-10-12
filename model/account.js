// mongoose schema for pulling a account/profile

const mongoose = require('mongoose');

const acconutSchema = new mongoose.Schema({
    username: String,
    usertag: String,
    // meta: {
    //     votes: Number,
    //     timePosted: Number
    // }
});

const Account = mongoose.model('Accounts', acconutSchema);

module.exports = Account;