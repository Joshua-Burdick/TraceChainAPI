const router = require('express').Router();
const path = require('path');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const ImageSchema = require('../model/upload');

const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: (req, file) => {
        return new Promise(async (resolve, reject) => {
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

let gfs;
mongoose.connection.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads'
  });
});

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

router.get('/:filename', (req, res) => {
    console.log("gfs", gfs)
    gfs.GridFSBucket.files.find({ filename: req.params.filename }).toArray((err, files) => {
        if (!files[0] || files.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No files available"
            }).end();
        }

        gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    });
});

module.exports = router;