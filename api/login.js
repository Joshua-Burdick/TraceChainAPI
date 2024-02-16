const router = require('express').Router();
const Login = require('../model/login');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
    try {
        res.json({ message: 'Hello World!' });
    } catch (error) {
        console.log("route / had the following error: ", error);
    }
})

// API endpoint for user login verification
router.post('/', async (req, res) => {
    console.log('IS THIS EVEN WORKIN?');
    console.log('Inside Post Request');
    // use req.body since the fields were passed in as URL parameters
    const { username, password} = req.body;
    try {
        // Check if the provided login credentials are valid by querying the "login" collection
        const user = await Login.findOne({ username });
        console.log('user ', user);
        
        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
            // If login is successful, get the user's account ID
            console.log("the user has id ", user.id);

            // create a JWT as a string that contains the user id and username
            // secret is the secret key that only the server knows 
            const token = jwt.sign({ id: user.id, username }, 'secret');

            // set an HTTP respponse header to create a new cookie in client's browser
            // user_token is the actualy token, httpOnly is a security measure
            res.setHeader('Set-Cookie', `user_token=${token}; HttpOnly;`);

            // send response
            res.json({ user, token });
            }
        }
        else {
            res.status(401).json({ message: 'Login failed. Invalid credentials.' });
        }

    } catch (error) {
        res.status(500).json({ message: 'An error occurred while processing the request.' });
    }
});

module.exports = router;