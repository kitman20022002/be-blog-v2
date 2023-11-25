const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category:{
      type: String,
      required: true,  
    },
    slug: {
      type: String,
      unique: true,
    },
    keyPoints: [{
      type: String,
      unique: true,
    }],
    description:  {
      type: String,
    },
  },
  { timestamps: true },
);

const Post = mongoose.model('Hobby', postSchema);
export default Post;