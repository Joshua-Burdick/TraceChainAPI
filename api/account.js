const { Router } = require('express');
const Account = require('../model/account');
const Post = require('../model/post');

const mongoose = require('mongoose');
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
});

router.get(`/:id/feed`, async (req, res) => {
    console.log("GENERATING FEED...");
    const { id } = req.params;
    try {
        console.log("id", id);
        const users = await Account.find({}).select('followers')
            .then(data => data.filter(user => user.followers.includes(id)))
            .then(data => data.map(user => user._id))
            .catch(err => console.error("An error occurred when trying to generate Feed: ", err));
        const data = await Post.find({ userId: { $in: users } }).sort({ time: -1 });
        console.log(data);
        res.json(data);
    } catch (error) {
        console.error("An error occurred when trying to generate Feed: ", error);
        res.status(500).json({ message: 'Error occurred while Feeding' });
    }
});

router.get('/search', async (req, res) => {
    const { searchParam } = req.query
    try {
        // console.log("sucess");
        // res.status(200).json({ message: 'yippee' });
        console.log("in searchParam route, ere is searchParam: ", searchParam);
        const data = await Account.find({ $or: [{ username: { $regex: String(searchParam), $options: 'i' } }, { usertag: { $regex: String(searchParam), $options: 'i' } }] });
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
        res.json(data);
    } catch (error) {
        console.error("An error occurred when trying to find the id: ", error);
        res.status(500).json({ message: 'Error occurred while fetching data' });
    }
});

router.get('/:id/header', async (req, res) => {
    // get the header of a post by the postid
    const { id } = req.params;
    console.log("Received request with ID", id);
    try {
        const idAsObjectId = new mongoose.Types.ObjectId(id);
        data = await Account.findById(idAsObjectId).exec();
        res.json({
            username: data.username,
            usertag: data.usertag
        });
    } catch (error) {
        console.error("An error occurred when trying to find the id: ", error);
        res.status(500).json({ message: 'Error occurred while fetching data' });
    }
});

router.put('/:id/follow', async (req, res) => {
    const { id } = req.params;
    const { followerId } = req.body;
    console.log("Received request with ID", id);
    try {
        const idAsObjectId = new mongoose.Types.ObjectId(id);
        const followerIdAsObjectId = new mongoose.Types.ObjectId(followerId);

        const followData = await Account.findByIdAndUpdate(idAsObjectId, { $push: { followers: followerIdAsObjectId } }, { new: true }).exec();
        const followingData = await Account.findByIdAndUpdate(followerIdAsObjectId, { $push: { following: idAsObjectId } }, { new: true }).exec();

        console.log(followData, followingData);

        res.json({ followData, followingData });
    } catch (error) {
        console.error("An error occurred when trying to find the id: ", error);
        res.status(500).json({ message: 'Error occurred while fetching data' });
    }
});

router.put('/:id/unfollow', async (req, res) => {
    const { id } = req.params;
    const { followerId } = req.body;
    console.log("Received request with ID", id); 
    try {
        const idAsObjectId = new mongoose.Types.ObjectId(id);
        const followerIdAsObjectId = new mongoose.Types.ObjectId(followerId);

        const followData = await Account.findByIdAndUpdate(idAsObjectId, { $pull: { followers: followerIdAsObjectId } }, { new: true }).exec();
        const followingData = await Account.findByIdAndUpdate(followerIdAsObjectId, { $pull: { following: idAsObjectId } }, { new: true }).exec();

        console.log(followData, followingData);

        res.json({ followData, followingData });
    } catch (error) {
        console.error("An error occurred when trying to find the id: ", error);
        res.status(500).json({ message: 'Error occurred while fetching data' });
    }
});



module.exports = router;