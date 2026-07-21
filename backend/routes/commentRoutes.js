const express = require('express');
const { protect } = require('../middlewares/auth');
const {
  getCommentsByBlog,
  createComment,
  deleteComment,
  toggleLike,
} = require('../controllers/commentController');

const router = express.Router();

router.get('/blog/:blogId', getCommentsByBlog);
router.post('/', protect, createComment);
router.delete('/:id', protect, deleteComment);
router.put('/:id/like', protect, toggleLike);

module.exports = router;
