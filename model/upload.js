// const mongoose = require('mongoose');
const { Schema, model, default: mongoose } = require('mongoose');

const ImageSchema = new mongoose.Schema({
    name: String,
    hash: String,
    postId: mongoose.Types.ObjectId
});

const imageUpload = model('imageUpload', ImageSchema, 'photos');

module.exports = imageUpload;