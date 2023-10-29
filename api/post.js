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

router.get('/:param', async (req, res) => {
  const { param } = req.params;
  console.log("Receiveed request with param", param);
  try {
    const idAsObjectId = new mongoose.Types.ObjectId(param);
    // const data = await Post.findOne({$or: [{_id: idAsObjectId},{userId: idAsObjectId}]}).exec();
    const userIdData = await Post.find({ _userid: idAsObjectId }).exec();
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

router.post('/:id/:content', async (req, res) => {
  try {
    const userId = req.params.id;
    const userIdAsObjectID = new mongoose.Types.ObjectId(userId);
    console.log(userId);
    const content = decodeURIComponent(req.params.content);

    console.log("content: ", content);

    await Post.create({
      _userId: userIdAsObjectID,
      content: content,
      time: Date.now(),
      sources: []
    });

    res.status(201).json({ message: "Post Inserted to collection" }).end();
  } catch (error) {
    console.log("The followin error occured at /:id/:content : ", error);
    res.status(500).json({ message: "Error occured" }).end();
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
