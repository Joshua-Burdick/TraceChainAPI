// mongoose schema for a user post

const { Schema, model, default: mongoose } = require('mongoose');

const postSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  userId: String,
  communityId: String,
  content: String,
  sources: [Object],
  replies: [String],
  likes: [String],
  dislikes: [String],
  parentPostId: String,
  isInformative: Boolean,
  isEdited: Boolean,
  time: Date
});

const Post = model('Post', postSchema, 'posts');

module.exports = Post;