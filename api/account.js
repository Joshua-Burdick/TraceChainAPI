const { Router } = require('express');
const Account = require('../model/account');

const mongoose =  require('mongoose');
const { ObjectId } = require('mongoose');

const router = Router();

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
    console.log("Receiveed request with ID", id);
    try {
        const idAsObjectId = new mongoose.Types.ObjectId(id);
        const data = await Account.findById(idAsObjectId).exec();
        console.log(data);
        res.json(data);
    } catch (error) {
        console.error("An error occurred when trying to find the id: ", error);
        res.status(500).json({ message: 'Error occurred while fetching data' });
    }
});


module.exports = router;