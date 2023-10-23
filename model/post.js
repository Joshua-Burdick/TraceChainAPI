// mongoose schema for a user post

const mongoose = require('mongoose');

const {MONGO_URI} = process.env;
const conn = mongoose.createConnection(MONGO_URI);

const postSchema = new mongoose.Schema({
  title: String,
  body: String,
  meta: {
    votes: Number,
    timePosted: Number
  } 
});

module.exports = conn.model('Post', postSchema);