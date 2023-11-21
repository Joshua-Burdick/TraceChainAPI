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
    const data = await Post.find({}).sort({ createdAt: -1});
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error("An error occurred when trying to generate Feed: ", error);
    res.status(500).json({ message: 'Error occurred while Feeding' });
  }
})

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log("Receiveed request with ID", id);
  try {
    const idAsObjectId = new mongoose.Types.ObjectId(id);
    const data = await Post.findById(idAsObjectId).exec();
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error("An error occurred when trying to find the id: ", error);
    res.status(500).json({ message: 'Error occurred while fetching data' });
  }
})




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
