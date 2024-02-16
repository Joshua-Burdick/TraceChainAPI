const router = require('express').Router();
const AccountVerification = require('../model/accountVerification');
const Account = require('../model/account');
const mongoose = require('mongoose');
const { ObjectId } = require('mongoose');


// localhost:1776/api/account
router.get('/', async (req, res) => {
    // try {
    //     res.json({ message: 'Hello World!' });
    // } catch (error) {
    //     console.log("there was an error");
    // }
    // res.json({ message: 'Hello World!' });   
    // const data = await Account.find().select('username usertag');
    try {
        res.json({ message: 'Hello World!' });
    } catch (error) {
        console.log("route / had the following error: ", error);
    }
    // res.json({ data });
})



router.get('/:id', async (req, res) => {
    // get data by id
    const { id } = req.params;
    console.log("Received request with ID", id);
    try {
        const idAsObjectId = new mongoose.Types.ObjectId(id);
        const data = await AccountVerification.findById(idAsObjectId).exec();
        console.log(data);
        res.json(data);
    } catch (error) {
        console.error("An error occurred when trying to find the id: ", error);
        res.status(500).json({ message: 'Error occurred while fetching data' });
    }
});


router.put('/:id/changeAccount', async(req, res) => {
//displayName, email, and username needs to be updated
    const userId  = req.params.id;
    const { displayName, email, username} = req.body;

  try {
    // Find the user by ID
    const user = await AccountVerification.findById(userId);

    if (!user) {
        return res.status(404).send('User not found');
    }

    // Update user information
    user.displayName = displayName || user.displayName;
    user.email = email || user.email;
    user.username = username || user.username;

    // Save the updated user
    await user.save();

    // Update user information in accounts collection
    await Account.updateOne({ _id: userId }, {
        username: user.displayName,
        email: user.email,
        usertag: user.username
    });

    // Respond with updated user
    res.json(user);
    }   catch (error) {
    console.error("An error occurred when trying to update the user: ", error);
    res.status(500).json({ message: 'Error occurred while updating user data' });
    }

})

module.exports = router;