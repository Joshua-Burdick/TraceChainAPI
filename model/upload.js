// const mongoose = require('mongoose');
const { Schema, model, default: mongoose } = require('mongoose');

const ImageSchema = new mongoose.Schema({
    name: String,
    img:
    {
        data: Buffer,
        contentType: String
    },
    hash: String,
    //numOccurences: Number
});

const imageUpload = model('imageUpload', ImageSchema, 'photos');

module.exports = imageUpload;