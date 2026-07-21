const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
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

bookmarkSchema.index({ user: 1, blog: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
