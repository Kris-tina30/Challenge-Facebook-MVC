const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      minlength: [15, 'Your name must by more than 15 characters!'],
    },

    userMessage: {
      type: String,
      required: true,
      minlength: [40, 'Your Message must by more than 40 characters!'],
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }],
  },
  { timestamps: true },
);
module.exports = mongoose.model('post', postSchema);
