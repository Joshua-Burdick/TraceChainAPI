const { Schema, model } = require('mongoose');

const RegisterSchema = new Schema({
  username: String, 
  displayName: String,
  password: String, 
  email: String, 
});

const Register = model('Register', RegisterSchema, 'accountTest');

module.exports = Register;
