const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');


const LoginSchema = new Schema({
    password: String,
    username: String,
})



const Login = model('Login', LoginSchema, 'accountTest');

module.exports = Login;