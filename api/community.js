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
});

router.post('/:id/', async (req, res) => {
  try {
    const communityId = new mongoose.Types.ObjectId();
    const community = req.body;
    if (!community) {
      return res.status(400).json({ message: 'Name and description are required' });
    };
    await Community.create({
      _id: communityId,
      userId: community.userId,
      name: community.name,
      description: community.description,
      members: community.members,
      time: new Date(community.time),
    });
    res.status(201).json({ message: 'Community created successfully', community});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// get the communities of a certain user by the userid
router.get('/user/:param', async (req, res) => {
  const { param } = req.params;
  console.log("Received request with param", param);
  try {
    const idAsObjectId = new mongoose.Types.ObjectId(param);
    // find the communities associated with that userId
    const userIdData = await Community.find({ userId: idAsObjectId }).sort({ time: -1 });
    if (userIdData) {
      console.log(userIdData);
      res.json(userIdData);
    } else {
      res.status(404).json({ message: 'No data was found' });
    }
  } catch (error) {
    console.error("An error occurred when trying to find the id: ", error);
    res.status(500).json({ message: 'Error occurred while fetching data' });
  }
})

router.post('/:id/join', async (req, res) => {
  try {
    const { id } = req.params;

    const community = await Community.findById(id);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    if (community.members.includes(id)) {
      return res.status(400).json({ message: 'User is already a member of the community' });
    }

    community.members.push(id);
    await community.save();

    res.status(200).json({ message: 'User joined the community successfully', community });
  } catch (error) {
    console.error("Error joining community:", error);
    res.status(500).json({ message: 'Error joining community' });
  }
});


module.exports = router;
