
const { Router } = require('express');
const Account = require('../model/account');

const mongoose = require('mongoose');
const { ObjectId } = require('mongoose');

const router = Router();

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

router.get('/search', async (req, res) => {
    const { searchParam } = req.query
    try {
        // console.log("sucess");
        // res.status(200).json({ message: 'yippee' });
        console.log("in searchParam route, ere is searchParam: ", searchParam);
        const data = await Account.find({ $or: [{ username: {$regex: String(searchParam)} }, { usertag: {$regex: String(searchParam)} }] });
        if (data) {
            console.log(data);
            res.json(data);
        } else {
            console.log("there was an error");
            res.status(500).json({ message: 'Error occurred while fetching data' });
        }
    } catch (error) {
        console.error("An error occurred when trying to find the id: ", error);
        res.status(500).json({ message: 'Error occurred while fetching data' });
    }
});

router.get('/:id', async (req, res) => {
    // get data by id
    const { id } = req.params;
    console.log("Receiveed request with ID", id);
    try {
        const idAsObjectId = new mongoose.Types.ObjectId(id);
        const data = await Account.findById(idAsObjectId).exec();
        console.log(data);
        res.json({ data });
    } catch (error) {
        console.error("An error occurred when trying to find the id: ", error);
        res.status(500).json({ message: 'Error occurred while fetching data' });
    }
});

// commented out temporarily until get request returns profile username and usertag as needed.
// router.get('/:id/posts', async (req, res) => {
//     // get a user's list of posts
// })

// router.put('/:id', async (req, res) => {
//     // edit something by _id mongo
// });

// router.delete('/:id', async (req, res) => {
//     // delete something by _id mongo
//     const { id } = req.params;
//     const data = await Profile.findByIdAndDelete(id);
//     res.json({ data });
// });

// router.post('/', async (req, res) => {
//     // post data
//     const { body } = req;
//     const data = await Profile.create(body);
//     res.json({ data });
// });

module.exports = router;