export {};
const mongoose = require('mongoose');
const { Types } = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: 'user',
    },
    event: {
      type: Types.ObjectId,
      ref: 'event',
    },
  },
  { timestamps: true },
);

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;