const { Schema, model, default: mongoose } = require('mongoose');

const communitySchema = new Schema({
  _id: mongoose.Types.ObjectId,
  userId: String,
  name: String,
  description: String,
  time: Date
});

const Community = model('Community', communitySchema, 'communities');

module.exports = Community;
