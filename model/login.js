const { Schema, model } = require('mongoose');

const LoginSchema = new Schema({
    password: String,
    username: String,
    email: String,
})

const Login = model('Login', LoginSchema, 'logins');

module.exports = Login;