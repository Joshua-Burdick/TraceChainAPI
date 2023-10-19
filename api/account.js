const router = require('express').Router();

const { default: mongoose } = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Account = require('../model/account');

router.get('/', async (req, res) => {
    // try {
    //     res.json({ message: 'Hello World!' });
    // } catch (error) {
    //     console.log("there was an error");
    // }
    // res.json({ message: 'Hello World!' });   
    // const data = await Account.find().select('username usertag');
    res.json({ message: 'Hello World!' });
    // res.json({ data });
})

router.get('/:id', async (req, res) => {
    // get data by id
    const { id } = req.params;
    console.log("Receiveed request with ID" , id);
    if(!ObjectId.isValid(id)){
        res.json({ message: 'Object ID invalid!' });
    }
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