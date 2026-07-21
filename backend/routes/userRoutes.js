const express = require('express');
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const { getUserProfile, updateProfile, getPopularAuthors } = require('../controllers/userController');

const router = express.Router();

router.get('/authors/popular', getPopularAuthors);
router.get('/profile/:id', getUserProfile);
router.put('/profile', protect, upload.single('avatar'), updateProfile);

module.exports = router;
