const express = require('express');
const { protect, admin } = require('../middlewares/auth');
const {
  getStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllBlogs,
  updateBlog,
  deleteBlog,
  getAllComments,
  deleteComment,
  getAllCategories,
} = require('../controllers/adminController');

const router = express.Router();

router.use(protect, admin);

router.get('/stats', getStats);

router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

router.get('/blogs', getAllBlogs);
router.put('/blogs/:id', updateBlog);
router.delete('/blogs/:id', deleteBlog);

router.get('/comments', getAllComments);
router.delete('/comments/:id', deleteComment);

router.get('/categories', getAllCategories);

module.exports = router;
