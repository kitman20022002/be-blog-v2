export {};
const mongoose = require('mongoose');
const { Types } = require('mongoose');

const bookMarkSchema = new mongoose.Schema(
  {
    event: {
      type: Types.ObjectId,
      ref: 'event',
    },
    user: {
      type: Types.ObjectId,
      ref: 'user',
    },
  },
  { timestamps: true },
);

const Bookmark = mongoose.model('Bookmark', bookMarkSchema);
module.exports = Bookmark;