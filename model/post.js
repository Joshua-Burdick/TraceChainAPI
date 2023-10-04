// mongoose schema for a user post

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  body: String,
  meta: {
    votes: Number,
    timePosted: Number
  }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;