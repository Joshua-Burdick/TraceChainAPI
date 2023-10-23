const router = require('express').Router();

const Post = require('../model/post');

router.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
})

router.get('/get_the_data', async (req, res) => {
  // get all data
  const big_data = await Post.find();
  res.json({ big_data });
})

router.get('/get_the_data/:id', async (req, res) => {
  // get data by id
  const { id } = req.params;
  console.log("Receiveed request with ID", id);
  try {
    // const idAsObjectId = mongoose.Types.ObjectId(id); 
    const data = await Post.findById(id).exec();
    console.log(data);
    res.json({ data });
  } catch (error) {
    console.error("An error occurred when trying to find the id: ", error);
    res.status(500).json({ message: 'Error occurred while fetching data' });
  }
});

router.post('/post_the_data', async (req, res) => {
  // post data
  const { body } = req;
  const data = await Post.create(body);
  res.json({ data });
});

router.put('/put_the_data/:id', async (req, res) => {
  // edit something by _id mongo
});

router.delete('/delete_the_data/:id', async (req, res) => {
  // delete something by _id mongo
  const { id } = req.params;
  const data = await Post.findByIdAndDelete(id);
  res.json({ data });
});

module.exports = router;
