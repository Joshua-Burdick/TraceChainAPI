// mongoose schema for a user post

const { Schema, model } = require('mongoose');

const postSchema = new Schema({
  title: String,
  body: String,
  meta: {
    votes: Number,
    timePosted: Number
  } 
});

const Post = model('Post', postSchema, 'posts');

module.exports = Post;