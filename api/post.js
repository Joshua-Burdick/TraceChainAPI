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

router.get(`/feed`, async (req, res) => {
  console.log("GENERATING FEED...");
  try {
    const data = await Post.find({}).sort({ time: -1 });
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error("An error occurred when trying to generate Feed: ", error);
    res.status(500).json({ message: 'Error occurred while Feeding' });
  }
})

// get the posts of a certain user by the userid
router.get('/user/:param', async (req, res) => {
  const { param } = req.params;
  console.log("Receiveed request with param", param);
  try {
    const idAsObjectId = new mongoose.Types.ObjectId(param);
    // find the posts associated with that userId
    const userIdData = await Post.find({ userId: idAsObjectId }).sort({ time: -1 });
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

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log("Receiv ed request with ID", id);
  try {
    const idAsObjectId = new mongoose.Types.ObjectId(id);
    const data = await Post.findById(idAsObjectId).exec();
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error("An error occurred when trying to find the id: ", error);
    res.status(500).json({ message: 'Error occurred while fetching data' });
  }
});

router.put('/:id/likes_dislikes', async (req, res) => {
  const { id } = req.params;
  console.log("Received likes/dislikes request with ID", id);
  try {
    const { userId, like, dislike, remove } = req.body;
    const idAsObjectId = new mongoose.Types.ObjectId(id);
    const data = await Post.findById(idAsObjectId).exec();
    if (data) {
      if (like) {
        if (remove) {
          data.likes.pull(userId);
        }
        else {
          data.likes.push(userId);
          data.dislikes.pull(userId);
        }
      }
      if (dislike) {
        if (remove) {
          data.dislikes.pull(userId);
        }
        else {
          data.dislikes.push(userId);
          data.likes.pull(userId);
        }
      }
      await data.save();
      res.json({ message: 'Post updated' });
    } else {
      res.status(404).json({ message: 'No data was found', data: `data: ${data}` });
    }
  } catch (error) {
    console.error("An error occurred when trying to update the likes/dislikes: ", error);
    res.status(500).json({ message: 'Error occurred while updating data' });
  }
});

router.post('/:id/', async (req, res) => {
  try {
    const userId = req.params.id;
    const post = req.body;
    const postId = new mongoose.Types.ObjectId();

    console.log("post.photos type in api: ", typeof(post.photos));

    await Post.create({
      _id: postId,
      userId: post.userId,
      content: post.content,
      sources: post.sources,
      photos: post.photos,
      likes: [],
      dislikes: [],
      isInformative: post.isInformative,
      isEdited: post.isEdited,
      time: new Date(post.time),
    });

    // res.status(201).json({ message: "Post Inserted to collection" }).end();
    res.status(201).json(postId);
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