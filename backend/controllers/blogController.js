const Blog = require('../models/Blog');
const Category = require('../models/Category');
const Bookmark = require('../models/Bookmark');
const cloudinary = require('../config/cloudinary');
const slugify = require('../utils/slugify');

const uploadImage = async (file) => {
  const b64 = file.buffer.toString('base64');
  const dataURI = `data:${file.mimetype};base64,${b64}`;
  const result = await cloudinary.uploader.upload(dataURI, {
    folder: 'blognest/blogs',
    resource_type: 'image',
  });
  return { public_id: result.public_id, url: result.secure_url };
};

const deleteImage = async (publicId) => {
  if (publicId) {
    await cloudinary.uploader.destroy(publicId);
  }
};

exports.getAllBlogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { isPublished: true };

    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    if (req.query.category) {
      const cat = await Category.findOne({ slug: req.query.category });
      if (cat) query.category = cat._id;
    }

    if (req.query.tag) {
      query.tags = { $in: [req.query.tag.toLowerCase()] };
    }

    if (req.query.author) {
      query.author = req.query.author;
    }

    let sort = { publishedAt: -1 };
    if (req.query.sort === 'oldest') sort = { publishedAt: 1 };
    if (req.query.sort === 'popular') sort = { views: -1 };
    if (req.query.sort === 'likes') sort = { 'likes': -1 };
    if (req.query.sort === 'trending') sort = { views: -1, publishedAt: -1 };

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .populate('author', 'name avatar')
      .populate('category', 'name slug')
      .sort(sort)
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

exports.getFeaturedBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ isPublished: true, isFeatured: true })
      .populate('author', 'name avatar')
      .populate('category', 'name slug')
      .sort({ publishedAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

exports.getTrendingBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .populate('author', 'name avatar')
      .populate('category', 'name slug')
      .sort({ views: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

exports.getLatestBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .populate('author', 'name avatar')
      .populate('category', 'name slug')
      .sort({ publishedAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyBlogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { author: req.user._id };

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
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

exports.getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true })
      .populate('author', 'name avatar bio')
      .populate('category', 'name slug');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    blog.views += 1;
    await blog.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

exports.createBlog = async (req, res, next) => {
  try {
    const { title, content, category, tags, excerpt, isPublished, isFeatured } = req.body;

    const parsedTags = tags
      ? typeof tags === 'string'
        ? tags.split(',').map((t) => t.trim().toLowerCase())
        : tags.map((t) => t.toLowerCase())
      : [];

    let featuredImage = { public_id: '', url: '' };
    if (req.file) {
      featuredImage = await uploadImage(req.file);
    }

    let slug = slugify(title);
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      slug = `${slug}-${Date.now()}`;
    }

    const blogExcerpt = excerpt
      ? excerpt.trim()
      : content
          .replace(/<[^>]*>/g, '')
          .substring(0, 200)
          .trim();

    const blog = await Blog.create({
      title,
      slug,
      content,
      excerpt: blogExcerpt,
      featuredImage,
      author: req.user._id,
      category,
      tags: parsedTags,
      isPublished: isPublished === 'true' || isPublished === true,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      publishedAt:
        isPublished === 'true' || isPublished === true ? new Date() : undefined,
    });

    await Category.findByIdAndUpdate(category, { $inc: { blogCount: 1 } });

    const populatedBlog = await Blog.findById(blog._id)
      .populate('author', 'name avatar')
      .populate('category', 'name slug');

    res.status(201).json({
      success: true,
      data: populatedBlog,
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

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this blog',
      });
    }

    const { title, content, category, tags, isPublished, isFeatured } = req.body;

    if (category && category !== blog.category.toString()) {
      await Category.findByIdAndUpdate(blog.category, { $inc: { blogCount: -1 } });
      await Category.findByIdAndUpdate(category, { $inc: { blogCount: 1 } });
    }

    let featuredImage = blog.featuredImage;
    if (req.file) {
      await deleteImage(blog.featuredImage.public_id);
      featuredImage = await uploadImage(req.file);
    }

    const updatedFields = {
      title: title || blog.title,
      content: content || blog.content,
      category: category || blog.category,
      featuredImage,
      isFeatured:
        isFeatured !== undefined
          ? isFeatured === 'true' || isFeatured === true
          : blog.isFeatured,
    };

    if (title) {
      updatedFields.slug = slugify(title);
    }

    if (content) {
      updatedFields.excerpt = content
        .replace(/<[^>]*>/g, '')
        .substring(0, 200)
        .trim();
    }

    if (tags) {
      updatedFields.tags =
        typeof tags === 'string'
          ? tags.split(',').map((t) => t.trim().toLowerCase())
          : tags.map((t) => t.toLowerCase());
    }

    if (isPublished !== undefined) {
      const published = isPublished === 'true' || isPublished === true;
      updatedFields.isPublished = published;
      if (published && !blog.publishedAt) {
        updatedFields.publishedAt = new Date();
      }
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

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this blog',
      });
    }

    await deleteImage(blog.featuredImage.public_id);

    await Category.findByIdAndUpdate(blog.category, { $inc: { blogCount: -1 } });

    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

exports.toggleLike = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    const userId = req.user._id;
    const likeIndex = blog.likes.indexOf(userId);

    if (likeIndex === -1) {
      blog.likes.push(userId);
    } else {
      blog.likes.splice(likeIndex, 1);
    }

    await blog.save();

    res.status(200).json({
      success: true,
      data: {
        likes: blog.likes,
        likeCount: blog.likes.length,
        isLiked: likeIndex === -1,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate({
        path: 'blog',
        populate: [
          { path: 'author', select: 'name avatar' },
          { path: 'category', select: 'name slug' },
        ],
      })
      .sort({ createdAt: -1 });

    const blogs = bookmarks.map((b) => b.blog).filter(Boolean);

    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

exports.toggleBookmark = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    const userId = req.user._id;
    const existingBookmark = await Bookmark.findOne({
      user: userId,
      blog: blog._id,
    });

    if (existingBookmark) {
      await Bookmark.findByIdAndDelete(existingBookmark._id);
      res.status(200).json({
        success: true,
        message: 'Bookmark removed',
        data: { isBookmarked: false },
      });
    } else {
      await Bookmark.create({ user: userId, blog: blog._id });
      res.status(200).json({
        success: true,
        message: 'Blog bookmarked',
        data: { isBookmarked: true },
      });
    }
  } catch (error) {
    next(error);
  }
};
