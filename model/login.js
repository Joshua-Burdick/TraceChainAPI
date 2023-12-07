const { Schema, model } = require('mongoose');

const LoginSchema = new Schema({
    password: String,
    username: String,
})

const Login = model('Login', LoginSchema, 'accountTest');

module.exports = Login;