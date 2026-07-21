const User = require('../models/User');
const Blog = require('../models/Blog');
const cloudinary = require('../config/cloudinary');

const uploadAvatar = async (file) => {
  const b64 = file.buffer.toString('base64');
  const dataURI = `data:${file.mimetype};base64,${b64}`;
  const result = await cloudinary.uploader.upload(dataURI, {
    folder: 'blognest/avatars',
    resource_type: 'image',
    transformation: [{ width: 300, height: 300, crop: 'fill' }],
  });
  return { public_id: result.public_id, url: result.secure_url };
};

exports.getPopularAuthors = async (req, res, next) => {
  try {
    const authors = await Blog.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$author', blogCount: { $sum: 1 } } },
      { $sort: { blogCount: -1 } },
      { $limit: 10 },
    ]);

    const populatedAuthors = await User.populate(authors, {
      path: '_id',
      select: 'name avatar bio',
    });

    const result = populatedAuthors.map((a) => ({
      _id: a._id._id,
      name: a._id.name,
      avatar: a._id.avatar,
      bio: a._id.bio,
      blogCount: a.blogCount,
    }));

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Blog.countDocuments({
      author: user._id,
      isPublished: true,
    });

    const blogs = await Blog.find({
      author: user._id,
      isPublished: true,
    })
      .populate('category', 'name slug')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        user,
        blogs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, bio } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;

    if (req.file) {
      if (user.avatar && user.avatar.public_id) {
        await cloudinary.uploader.destroy(user.avatar.public_id);
      }
      user.avatar = await uploadAvatar(req.file);
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
