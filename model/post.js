// mongoose schema for a user post

const { Schema, model, default: mongoose } = require('mongoose');

const postSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  userId: String,
  content: String,
  sources: [String],
  likes: Number,
  dislikes: Number,
  isInformative: Boolean,
  isEdited: Boolean,
  time: Date
});

const Post = model('Post', postSchema, 'posts');

module.exports = Post;