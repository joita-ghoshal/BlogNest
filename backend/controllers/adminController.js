const User = require('../models/User');
const Blog = require('../models/Blog');
const Category = require('../models/Category');
const Comment = require('../models/Comment');
const Bookmark = require('../models/Bookmark');
const cloudinary = require('../config/cloudinary');
const slugify = require('../utils/slugify');
const bcrypt = require('bcryptjs');

const VALID_ROLES = ['user', 'admin'];

exports.getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalBlogs, totalCategories, totalComments, publishedBlogs, unpublishedBlogs, viewsAndLikes] =
      await Promise.all([
        User.countDocuments(),
        Blog.countDocuments(),
        Category.countDocuments(),
        Comment.countDocuments(),
        Blog.countDocuments({ isPublished: true }),
        Blog.countDocuments({ isPublished: false }),
        Blog.aggregate([
          { $group: { _id: null, totalViews: { $sum: '$views' }, totalLikes: { $sum: { $size: '$likes' } } } },
        ]),
      ]);

    const totals = viewsAndLikes[0] || { totalViews: 0, totalLikes: 0 };

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalBlogs,
        totalCategories,
        totalComments,
        publishedBlogs,
        unpublishedBlogs,
        totalViews: totals.totalViews,
        totalLikes: totals.totalLikes,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await User.countDocuments();

    await User.updateMany(
      { role: { $nin: VALID_ROLES } },
      { $set: { role: 'user' } }
    );

    const users = await User.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.fixStaleRoles = async (req, res, next) => {
  try {
    const result = await User.updateMany(
      { role: { $nin: VALID_ROLES } },
      { $set: { role: 'user' } }
    );

    res.status(200).json({
      success: true,
      message: `Fixed ${result.modifiedCount} user(s) with invalid roles`,
      data: { modifiedCount: result.modifiedCount },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be "user" or "admin"',
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own role',
      });
    }

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: false }
    );

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { name, email, bio, isActive, password } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;
    if (bio !== undefined) updateFields.bio = bio;
    if (isActive !== undefined) updateFields.isActive = isActive;
    if (password && password.length >= 6) {
      const salt = await bcrypt.genSalt(12);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: false }
    );

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

exports.toggleUserActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot deactivate your own account' });
    }

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: !user.isActive },
      { new: true, runValidators: false }
    );

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
      });
    }

    if (user.avatar && user.avatar.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    const blogs = await Blog.find({ author: user._id });
    for (const blog of blogs) {
      if (blog.featuredImage && blog.featuredImage.public_id) {
        await cloudinary.uploader.destroy(blog.featuredImage.public_id);
      }
      await Category.findByIdAndUpdate(blog.category, { $inc: { blogCount: -1 } });
      await Comment.deleteMany({ blog: blog._id });
    }

    await Blog.deleteMany({ author: user._id });
    await Comment.deleteMany({ user: user._id });
    await Bookmark.deleteMany({ user: user._id });
    const userBlogIds = blogs.map((b) => b._id);
    await Bookmark.deleteMany({ blog: { $in: userBlogIds } });
    await User.findByIdAndDelete(user._id);

    res.status(200).json({
      success: true,
      message: 'User and associated data deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllBlogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await Blog.countDocuments();
    const blogs = await Blog.find()
      .populate('author', 'name email avatar')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateBlog = async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    const { title, content, category, tags, isPublished, isFeatured } = req.body;

    const updatedFields = {};

    if (title) {
      updatedFields.title = title;
      updatedFields.slug = slugify(title);
    }
    if (content) updatedFields.content = content;
    if (category && category !== blog.category.toString()) {
      await Category.findByIdAndUpdate(blog.category, { $inc: { blogCount: -1 } });
      await Category.findByIdAndUpdate(category, { $inc: { blogCount: 1 } });
      updatedFields.category = category;
    } else if (category) {
      updatedFields.category = category;
    }
    if (isPublished !== undefined) {
      updatedFields.isPublished = isPublished === 'true' || isPublished === true;
      if (updatedFields.isPublished && !blog.publishedAt) {
        updatedFields.publishedAt = new Date();
      }
    }
    if (isFeatured !== undefined) {
      updatedFields.isFeatured = isFeatured === 'true' || isFeatured === true;
    }
    if (tags) {
      updatedFields.tags =
        typeof tags === 'string'
          ? tags.split(',').map((t) => t.trim().toLowerCase())
          : tags.map((t) => t.toLowerCase());
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, updatedFields, {
      new: true,
      runValidators: true,
    })
      .populate('author', 'name avatar')
      .populate('category', 'name slug');

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    if (blog.featuredImage && blog.featuredImage.public_id) {
      await cloudinary.uploader.destroy(blog.featuredImage.public_id);
    }

    await Category.findByIdAndUpdate(blog.category, { $inc: { blogCount: -1 } });
    await Comment.deleteMany({ blog: blog._id });
    await Blog.findByIdAndDelete(blog._id);

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllComments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await Comment.countDocuments();
    const comments = await Comment.find()
      .populate('user', 'name avatar')
      .populate('blog', 'title slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    const deleteReplies = async (commentId) => {
      const replies = await Comment.find({ parentComment: commentId });
      for (const reply of replies) {
        await deleteReplies(reply._id);
        await Comment.findByIdAndDelete(reply._id);
      }
    };

    await deleteReplies(comment._id);
    await Comment.findByIdAndDelete(comment._id);

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
