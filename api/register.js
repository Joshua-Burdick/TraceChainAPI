const router = require('express').Router();
const mongoose = require('mongoose');
const Register = require('../model/register');

router.get('/', (req, res) => {
  try {
    res.json({ message: 'Hello World from Register' });
  } catch (error) {
    console.log("route / had the following error: ", error);
  }
})

router.post('/', async (req, res) => {
  try {
    const { displayName, username, password, email } = req.body;

    const newRegistration = new Register({ displayName, username, password, email });
    await newRegistration.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = router;
