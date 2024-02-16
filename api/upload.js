const router = require('express').Router();
const util = require('util');
const bcrypt = require('bcrypt');
const multer = require('multer');
const ImageSchema = require('../model/upload');

router.get('/', (req, res) => {
    res.send('success');
})

const Storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    },
})

const upload = multer({
    storage: Storage
}).single('testImage');

router.post('/new', upload, async (req, res) => {
    console.log("iamge");
    // upload(req, res, (err) => {
    //     if (err) {
    //         console.log("Following error occured in .post /upload/new: ", err);
    //     } else {
    //         await ImageSchema.create({
    //             name: req.body.name,
    //             img: {
    //                 data: req.file.filename,
    //                 contentType: "image/png"
    //             }
    //         })
    //     }
    // })
    try {
        const salt = await bcrypt.genSalt(5);
        const image = req.file.filename;

        // Hash the password using the generated salt
        const imgHash = await bcrypt.hash(image, salt);
        console.log("hash: ", imgHash);
        console.log("hash type ", typeof(imgHash));

        const newImg = await ImageSchema.create({
            name: req.body.name,
            img: {
                data: req.file.filename,
                contentType: "image/jpeg"
            },
            hash: imgHash
            // // Generate a salt
            // const salt = await bcrypt.genSalt(12);

            // // Hash the password using the generated salt
            // const hash = await bcrypt.hash(user.password, salt);

            // // Update the user's password with the hashed one
            // user.password = hash;

            // // Continue with the save operation
            // return next();

            //hash: 

            // hash the image
            // if the image hash already exists, you do not need to reupload it
            // numOccurences = # of postIds where ut iccyrs
        });
        console.log(newImg);
        res.status(201).json({ message: "Photo uploaded." });
    } catch (error) {
        console.log("The following error occurred at /upload/new: ", error);
        res.status(500).json({ message: "Error occurred" }).end();
    }
})

// router.get('/', (req, res) => {
//     imgSchema.find({})
//         .then((data, err) => {
//             if (err) {
//                 console.log(err);
//             }
//             res.render('imagepage', { items: data })
//         })
// });

// router.post('/', upload.single('image'), (req, res, next) => {
//     let obj = {
//         name: req.body.name,
//         desc: req.body.desc,
//         img: {
//             data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
//             contentType: 'image/png'
//         }
//     }
//     imgSchema.create(obj)
//         .then((err, item) => {
//             if (err) {
//                 console.log(err);
//             }
//             else {
//                 // item.save();
//                 res.redirect('/');
//             }
//         });
// });

module.exports = router;