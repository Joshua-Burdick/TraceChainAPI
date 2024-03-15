// mongoose schema for a user post

const { Schema, model, default: mongoose } = require('mongoose');

const postSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  userId: String,
  content: String,
  sources: [Object],
<<<<<<< HEAD
  photos: [Object],
=======
  replies: [String],
>>>>>>> 9a55543da89fd4f5c49afecb102143ccf6024f77
  likes: [String],
  dislikes: [String],
  parentPostId: String,
  isInformative: Boolean,
  isEdited: Boolean,
  time: Date
});

const Post = model('Post', postSchema, 'posts');

module.exports = Post;