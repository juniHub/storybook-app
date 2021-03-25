const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
 
  image: String,
  imageId: String,

  title: {
    type: String,
    required: true,
    trim: true,
  },
  
  body: {
    type: String,
   
  },
  status: {
    type: String,
    default: 'public',
    enum: ['public', 'private'],
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Story', StorySchema);
