// mongoose schema for a user post

const { Schema, model, default: mongoose } = require('mongoose');

const postSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  userId: String,
  content: String,
  sources: [Object],
  photos: [String],
  likes: [String],
  dislikes: [String],
  isInformative: Boolean,
  isEdited: Boolean,
  time: Date
});

const Post = model('Post', postSchema, 'posts');

module.exports = Post;