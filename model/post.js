// mongoose schema for a user post

const { Schema, model } = require('mongoose');

const postSchema = new Schema({
  _userId: String,
  content: String,
  time: {
    t: Number,
    i: Number,
  },
  sources: [String]
  // meta: {
  //   votes: Number,
  //   timePosted: Number
  // } 
  }, {
    timestamps: true
});

const Post = model('Post', postSchema, 'posts');

module.exports = Post;