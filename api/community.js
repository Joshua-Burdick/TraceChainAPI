const router = require('express').Router();
const Community = require('../model/community');
const mongoose = require('mongoose');

router.get('/', (req, res) => {
  try {
    res.json({ message: 'Hello World from Post!' });
  } catch (error) {
    console.log("route / had the following error: ", error);
  }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    console.log("Received request with ID", id);
    try {
      const idAsObjectId = new mongoose.Types.ObjectId(id);
      const data = await Community.findById(idAsObjectId).exec();
      console.log(data);
      res.json(data);
    } catch (error) {
      console.error("An error occurred when trying to find the id: ", error);
      res.status(500).json({ message: 'Error occurred while fetching data' });
    }
  });

  router.get(`/:id/communities`, async (req, res) => {
    console.log("GENERATING COMMUNITIES...");
    try {
      const data = await Community.find({}).sort({ time: -1 });
      console.log(data);
      res.json(data);
    } catch (error) {
      console.error("An error occurred when trying to generate Communities: ", error);
      res.status(500).json({ message: 'Error occurred while Feeding' });
    }
  })

router.post('/:id/', async (req, res) => {
  console.log('is it working')
  try {
    const communityId = new mongoose.Types.ObjectId();
    const community = req.body;
    console.log('partially')
    if (!community) {
      return res.status(400).json({ message: 'Name and description are required' });
    };
    await Community.create({
      _id: communityId,
      userId: community.userId,
      name: community.name,
      description: community.description,
      time: new Date(community.time),
    });
    res.status(201).json({ message: 'Community created successfully', community});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
