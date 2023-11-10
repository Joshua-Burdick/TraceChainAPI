const router = require('express').Router();
const Login = require('../model/login');
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');
const { ObjectId } = require('mongoose');


router.get('/', async (req, res) => {
    try {
        res.json({ message: 'Hello World!' });
    } catch (error) {
        console.log("route / had the following error: ", error);
    }
})

// API endpoint for user login verification
router.post('/:username/:password/:email', async (req, res) => {
    console.log('Inside Post Request');
    // use req.params since the fields were passed in as URL parameters
    const { username, password, email } = req.params;
    try {
        // Check if the provided login credentials are valid by querying the "login" collection
        const user = await Login.findOne({ password: password, username: username, email: email });
        console.log('user ', user);
        if (user) {
            // If login is successful, get the user's account ID
            console.log("the user has id ", user.id);

            // router.get('/:id', async (req, res) => {
            //     // get data by id
            //     const { id } = req.params;
            //     console.log("Received request with ID", id);
            //     try {
            //         const idAsObjectId = new mongoose.Types.ObjectId(id);
            //         const data = await Account.findById(idAsObjectId).exec();
            //         console.log(data);
            //         res.json({ data });
            //     } catch (error) {
            //         console.error("An error occurred when trying to find the id: ", error);
            //         res.status(500).json({ message: 'Error occurred while fetching data' });
            //     }
            // });
            // res.status(201).json({ message: 'Success' });

            // create a JWT as a string that contains the user id and username
            // secret is the secret key that only the server knows 
            const token = jwt.sign({ id: user.id, username }, 'secret');

            // set an HTTP respponse header to create a new cookie in client's browser
            // user_token is the actualy token, httpOnly is a security measure
            res.setHeader('Set-Cookie', `user_token=${token}; HttpOnly;`);

            // send response
            res.json({ user, token });
        }
        else {
            res.status(401).json({ message: 'Login failed. Invalid credentials.' });
        }

    } catch (error) {
        res.status(500).json({ message: 'An error occurred while processing the request.' });
    }
});





module.exports = router;