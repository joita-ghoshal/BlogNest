const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  },
  { timestamps: true }
);

likeSchema.index({ user: 1, blog: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema);
