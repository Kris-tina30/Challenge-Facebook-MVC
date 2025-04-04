const mongoose = require('mongoose');
const { Schema } = mongoose;
const commentSchema = new mongoose.Schema(
  {
    userComment: {
      type: String,
      required: true,
      minlength: [25, 'Your Comment must by more than 25 characters!'],
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'post',
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model('comment', commentSchema);
