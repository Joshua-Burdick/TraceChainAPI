const { Router } = require('express');
const Login = require('../model/login');

const mongoose =  require('mongoose');
const { ObjectId } = require('mongoose');

const router = Router();

router.get('/', async (req, res) => {
    try {
        res.json({ message: 'Hello World!' });
    } catch (error) {
        console.log("route / had the following error: ", error);
    }
})

// API endpoint for user login verification
router.post('/login/:username/:password', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the provided login credentials are valid by querying the "login" collection
        const user = await Login.findOne({ username, password });

        if (user) {
            // If login is successful, get the user's account ID
            const { id } = req.params;
            console.log("Received request with ID", id);
        try {
        const idAsObjectId = new mongoose.Types.ObjectId(id);
        const data = await Account.findById(idAsObjectId).exec();
        console.log(data);
        res.json({ data });
        }   
        catch (error) {
        console.error("An error occurred when trying to find the id: ", error);
        res.status(500).json({ message: 'Error occurred while fetching data' });
        }
        } else {
            res.status(401).json({ message: 'Login failed. Invalid credentials.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while processing the request.' });
    }
});





module.exports = router;