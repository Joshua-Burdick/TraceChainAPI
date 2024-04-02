const router = require('express').Router();
const path = require('path');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const ImageSchema = require('../model/upload');

// Create mongo connection
const conn = mongoose.createConnection(process.env.MONGO_URI);

let gfs;

conn.once('open', () => {
    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: (req, file) => {
        return new Promise(async (resolve, reject) => {
            if (err) {
                return reject(err);
            }
            const filename = await bcrypt.hash(file.originalname, 5) + path.extname(file.originalname);
            const fileInfo = {
                filename: filename,
                bucketName: 'uploads'
            };
            resolve(fileInfo);
        });
    },
});
const upload = multer({ storage });

// mongoose.connection.once('open', () => {
//     gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
//         bucketName: 'uploads'
//     });
// });

router.post('/:postId', upload.single('file'), async (req, res) => {
    const { file } = req;
    const { postId } = req.params;
    console.log("Received file: ", file, postId);

    ImageSchema.findOne({ filename: file.filename })
        .then((image) => {
            if (image) {
                res.status(200).json({
                    message: 'File already exists',
                    success: false
                });
            }

            const newImage = new ImageSchema({
                name: file.originalname,
                hash: file.filename.replace(`.${path.extname(file.originalname)}`, ''),
                postId: postId
            });

            newImage.save()
                .then((image) => {
                    res.status(200).json({
                        success: true,
                        image
                    })
                })
                .catch((error) => res.status(500).json(error));
        })
        .catch((error) => res.status(500).json(error));
});

// @route GET /find/:filename
// @desc find a file by its filename, passed into body
router.get('/find/:filename', async (req, res) => {
    // console.log("gfs.GridFSBucket", gfs.GridFSBucket);
    // let gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    //     bucketName: 'uploads'
    // });

    console.log(req.params.filename);

    // console.log("gfs", gfs);
    // console.log("gfs.files", gfs.files);

    const file = await gfs.files.find({ filename: req.params.filename }).toArray();
    console.log("file: ", file);
    // res.status(200).json(file)

    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        // Read output to browser
        const readstream = gfs.createReadStream(file.filename);
        // readstream.pipe(res);
        readstream.pipe(file);
    } else {
        res.status(404).json({
            err: 'Not an image'
        })
    }

    res.status(200).json(result)

});

// @route GET /files
// @desc  Display all files in JSON
router.get('/files', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
            return res.status(404).json({
                err: 'No files exist'
            });
        }

        // Files exist
        return res.json(files);
    });
});


// @route GET /image/:filename
// @desc Display Image
// router.get('/image/:filename', (req, res) => {
//     gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//         // Check if file
//         if (!file || file.length === 0) {
//             return res.status(404).json({
//                 err: 'No file exists'
//             });
//         }

//         // Check if image
//         if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
//             // Read output to browser
//             const readstream = gfs.createReadStream(file.filename);
//             readstream.pipe(res);
//         } else {
//             res.status(404).json({
//                 err: 'Not an image'
//             });
//         }
//     });
// });



module.exports = router;