const Comment = require('../models/Comment');
const Blog = require('../models/Blog');

exports.getCommentsByBlog = async (req, res, next) => {
  try {
    const { blogId } = req.params;

    const comments = await Comment.find({
      blog: blogId,
      parentComment: null,
    })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    const getReplies = async (commentId) => {
      const replies = await Comment.find({ parentComment: commentId })
        .populate('user', 'name avatar')
        .sort({ createdAt: 1 });

      const populatedReplies = await Promise.all(
        replies.map(async (reply) => ({
          ...reply.toObject(),
          replies: await getReplies(reply._id),
        }))
      );

      return populatedReplies;
    };

    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => ({
        ...comment.toObject(),
        replies: await getReplies(comment._id),
      }))
    );

    res.status(200).json({
      success: true,
      data: commentsWithReplies,
    });
  } catch (error) {
    next(error);
  }
};

exports.createComment = async (req, res, next) => {
  try {
    const { content, blogId, parentCommentId } = req.body;

    if (!content || !blogId) {
      return res.status(400).json({
        success: false,
        message: 'Content and blog ID are required',
      });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({
          success: false,
          message: 'Parent comment not found',
        });
      }
    }

    const comment = await Comment.create({
      content,
      user: req.user._id,
      blog: blogId,
      parentComment: parentCommentId || null,
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      'user',
      'name avatar'
    );

    res.status(201).json({
      success: true,
      data: populatedComment,
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

    if (
      comment.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment',
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

exports.toggleLike = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    const userId = req.user._id;
    const likeIndex = comment.likes.indexOf(userId);

    if (likeIndex === -1) {
      comment.likes.push(userId);
    } else {
      comment.likes.splice(likeIndex, 1);
    }

    await comment.save();

    res.status(200).json({
      success: true,
      data: {
        likes: comment.likes,
        likeCount: comment.likes.length,
        isLiked: likeIndex === -1,
      },
    });
  } catch (error) {
    next(error);
  }
};
