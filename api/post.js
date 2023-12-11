const router = require('express').Router();
const mongoose = require('mongoose');
const Post = require('../model/post');

router.get('/', (req, res) => {
  try {
    res.json({ message: 'Hello World from Post!' });
  } catch (error) {
    console.log("route / had the following error: ", error);
  }
})

// router.get('/:id', async (req, res) => {
//   const { id } = req.params;
//   console.log("Receiveed request with ID", id);
//   try {
//     const idAsObjectId = new mongoose.Types.ObjectId(id);
//     const data = await Post.findById(idAsObjectId).exec();
//     console.log(data);
//     res.json(data);
//   } catch (error) {
//     console.error("An error occurred when trying to find the id: ", error);
//     res.status(500).json({ message: 'Error occurred while fetching data' });
//   }
// })

router.get(`/feed`, async (req, res) => {
  console.log("GENERATING FEED...");
  try {
    const data = await Post.find({}).sort({ createdAt: -1});
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error("An error occurred when trying to generate Feed: ", error);
    res.status(500).json({ message: 'Error occurred while Feeding' });
  }
})

// get the posts of a certain user by the userid
router.get('/:param', async (req, res) => {
  const { param } = req.params;
  console.log("Receiveed request with param", param);
  try {
    const idAsObjectId = new mongoose.Types.ObjectId(param);
    // find the posts associated with that userId
    const userIdData = await Post.find({ _userId: idAsObjectId }).sort({ createdAt: -1 });
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

router.post('/:id/', async (req, res) => {
  try {
    const userId = req.params.id;
    const userIdAsObjectID = new mongoose.Types.ObjectId(userId);
    console.log(userId);
    const post = req.body;

    await Post.create({
      _id: userIdAsObjectID,
      userId: post.userId,
      content: post.content,
      sources: post.sources,
      likes: 0,
      dislikes: 0,
      isInformative: post.isInformative,
      isEdited: post.isEdited,
      time: post.time,
    });

    res.status(201).json({ message: "Post Inserted to collection" }).end();
  } catch (error) {
    console.log("The following error occurred at /:id/:content : ", error);
    res.status(500).json({ message: "Error occurred" }).end();
  }
});

// router.put('/put_the_data/:id', async (req, res) => {
//   // edit something by _id mongo
// });

// router.delete('/delete_the_data/:id', async (req, res) => {
//   // delete something by _id mongo
//   const { id } = req.params;
//   const data = await Post.findByIdAndDelete(id);
//   res.json({ data });
// });

module.exports = router;
