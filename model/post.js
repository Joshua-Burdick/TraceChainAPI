// mongoose schema for a user post

const { Schema, model } = require('mongoose');

const postSchema = new Schema({
  _userId: String,
  content: String,
  time: Date,
  sources: [String],
  likes: Number,
  dislikes: Number,
  isInformative: Boolean,
  isEdited: Boolean
  // meta: {
  //   votes: Number,
  //   timePosted: Number
  // } 
});

const Post = model('Post', postSchema, 'posts');

module.exports = Post;