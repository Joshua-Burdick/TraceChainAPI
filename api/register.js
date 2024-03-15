const router = require('express').Router();
const mongoose = require('mongoose');
const Register = require('../model/register');
const Account = require('../model/account');
const bcrypt = require('bcrypt');
const Mailjet = require ('node-mailjet');
const mailjet = Mailjet.apiConnect(
  'f5daad7d02a460f646edfc518a6fb04a',
  'fe1b16cf308c0faec0e0a5c57739bc1b'
);

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

    const newRegistration = new Register({ displayName, username, password, email});
    await newRegistration.save();

    await Account.create({
      _id: new mongoose.Types.ObjectId(newRegistration._id),
      username: displayName,
      usertag: username,
      posts: [],
      followers: [],
      following: []
    })

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const idAsObjectId = new mongoose.Types.ObjectId(id);
    await Register.deleteOne({ _id: idAsObjectId });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/sendConfirmationEmail', async (req, res) => {
  try {
    // Create a Mailjet request
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'tracechainassist@gmail.com',
            Name: 'Account creation confirmation'
          },
          To: [
            {
              Email: req.body.recipientEmail,
              Name: req.body.recipientName
            }
          ],
          TemplateID: 5749504, // Replace with your Mailjet template ID
          TemplateLanguage: true,
          Subject: 'TraceChain Email Confirmation',
          Variables: {}
        }
      ]
    });
    console.log('Are we still in');
    // Send the email
    const result = await request;
    console.log(result.body);

    // Respond with success
    res.status(200).json({ message: 'Confirmation email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'An error occurred while sending the confirmation email' });
  }
});

module.exports = router;
