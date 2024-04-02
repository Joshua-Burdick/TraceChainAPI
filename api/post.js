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

// get the posts of a certain user by the userid
router.get('/user/:param', async (req, res) => {
  const { param } = req.params;
  try {
    const idAsObjectId = new mongoose.Types.ObjectId(param);
    // find the posts associated with that userId
    const userIdData = await Post.find({ userId: idAsObjectId }).sort({ time: -1 });
    if (userIdData) {
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
  try {
    const idAsObjectId = new mongoose.Types.ObjectId(id);
    const data = await Post.findById(idAsObjectId).exec();
    res.json(data);
  } catch (error) {
    console.error("An error occurred when trying to find the id: ", error);
    res.status(500).json({ message: 'Error occurred while fetching data' });
  }
});

router.get('/:id/replies', async (req, res) => {
  const { id } = req.params;
  
  try {
    const idAsObjectId = new mongoose.Types.ObjectId(id);
    const data = await Post.findById(idAsObjectId).exec();

    if (data) {
      const replies = await Post.find({ _id: { $in: data.replies } });
      res.json(replies);
    } else {
      res.status(404).json({ message: 'No data was found', data: `data: ${data}` });
    }
  } catch (error) {
    console.error("An error occurred when trying to find the replies: ", error);
    res.status(500).json({ message: 'Error occurred while fetching data' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const post = req.body;
    const idAsObjectId = new mongoose.Types.ObjectId(id);
    const data = await Post.findById(idAsObjectId).exec();

    if (data) {
      data.content = post.content;
      data.sources = post.sources;
      data.isInformative = post.isInformative;
      data.isEdited = true;
      data.photos = post.photos;
      data.time = new Date(post.time);
      await data.save();

      res.json({ message: 'Post updated' });
    } else {
      res.status(404).json({ message: 'No data was found', data: `data: ${data}` });
    }
  } catch (error) {
    console.error("An error occurred when trying to update the post: ", error);
    res.status(500).json({ message: 'Error occurred while updating data' });
  }
});

router.post('/:id/images', async (req, res) => {
  const { id } = req.params;
  console.log("Received request with ID", id);

  try {
    const post = req.body;
    const idAsObjectId = new mongoose.Types.ObjectId(id);
    const data = await Post.findById(idAsObjectId).exec();

    if (data) {
      data.photos = post.photos;
      await data.save();

      res.json({ message: 'Post updated' });
    } else {
      res.status(404).json({ message: 'No data was found', data: `data: ${data}` });
    }
  } catch (error) {
    console.error("An error occurred when trying to update the post: ", error);
    res.status(500).json({ message: 'Error occurred while updating data' });
  }
});

router.put('/:id/replies', async (req, res) => {
  const { id } = req.params;

  try {
    const { replyId } = req.body;
    const idAsObjectId = new mongoose.Types.ObjectId(id);
    const data = await Post.findById(idAsObjectId).exec();

    if (data) {
      data.replies.push(replyId);
      await data.save();
      res.json({ message: 'Post updated' });
    }
    else {
      res.status(404).json({ message: 'No data was found', data: `data: ${data}` });
    }
  } catch (error) {
    console.error("An error occurred when trying to update the replies: ", error);
    res.status(500).json({ message: 'Error occurred while updating data' });
  }
});

router.put('/:id/likes_dislikes', async (req, res) => {
  const { id } = req.params;
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

router.post('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const post = req.body;
    const postId = new mongoose.Types.ObjectId();

    await Post.create({
      _id: postId,
      userId: post.userId,
      content: post.content,
      sources: post.sources,
      photos: post.photos,
      replies: [],
      likes: [],
      dislikes: [],
      parentPostId: post.parentPostId,
      isInformative: post.isInformative,
      isEdited: post.isEdited,
      time: new Date(post.time),
    });

    res.status(201).json(postId).end();
  } catch (error) {
    console.log("The following error occurred at /:id/:content : ", error);
    res.status(500).json({ message: "Error occurred" }).end();
  }
});


router.delete(`/:id`, async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id).exec();
    
    if (post.parentPostId) {
      const parentPost = await Post.findById(post.parentPostId).exec();
      console.log("Parent Post:", parentPost);
      parentPost.replies.pull(id);
      await parentPost.save();
    }

    await post.deleteOne().exec();
  } catch (error) {
    res.status(500).json({ message: "Error deleting post: "});
  }
  res.status(200).json({ message: "post deleted"});
});

module.exports = router;