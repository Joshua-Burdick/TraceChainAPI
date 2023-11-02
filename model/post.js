// mongoose schema for a user post

const { Schema, model, default: mongoose } = require('mongoose');

const postSchema = new Schema({
  _userId: mongoose.Types.ObjectId,
  content: String,
  time: Date,
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