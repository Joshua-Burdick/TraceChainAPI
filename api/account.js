const router = require('express').Router();

const Account = require('../model/account');

router.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
})

router.get('/:id', async (req, res) => {
    // get data by id
    const { id } = req.params;
    const data = await Account.findById(id);
    res.json({ data });
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