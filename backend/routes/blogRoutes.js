const express = require('express');
const { protect, optionalAuth } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const {
  getAllBlogs,
  getFeaturedBlogs,
  getTrendingBlogs,
  getLatestBlogs,
  getMyBlogs,
  getBookmarks,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleLike,
  toggleBookmark,
} = require('../controllers/blogController');

const router = express.Router();

router.get('/', optionalAuth, getAllBlogs);
router.get('/featured', getFeaturedBlogs);
router.get('/trending', getTrendingBlogs);
router.get('/latest', getLatestBlogs);
router.get('/my', protect, getMyBlogs);
router.get('/bookmarks', protect, getBookmarks);
router.get('/:slug', optionalAuth, getBlogBySlug);

router.post('/', protect, upload.single('image'), createBlog);
router.put('/:id', protect, upload.single('image'), updateBlog);
router.delete('/:id', protect, deleteBlog);

router.put('/:id/like', protect, toggleLike);
router.put('/:id/bookmark', protect, toggleBookmark);

module.exports = router;
