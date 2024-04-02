const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');


const RegisterSchema = new Schema({
  username: String, 
  displayName: String,
  password: String, 
  email: String, 
  bio: String,
});

RegisterSchema.pre('save', async function (next) {
  const user = this;

  // Hash the password only if it's modified or a new user
  if (!user.isNew) {
    return next();
  }

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(12);

    // Hash the password using the generated salt
    const hash = await bcrypt.hash(user.password, salt);

    // Update the user's password with the hashed one
    user.password = hash;

    // Continue with the save operation
    return next();
  } catch (error) {
    return next(error);
  }
});

const Register = model('Register', RegisterSchema, 'accountTest');

module.exports = Register;
