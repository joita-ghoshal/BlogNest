import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiHeart, HiOutlineHeart, HiBookmark, HiOutlineBookmark, HiShare } from 'react-icons/hi';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import blogService from '../services/blogService';
import commentService from '../services/commentService';
import useAuth from '../hooks/useAuth';
import { formatDate, estimateReadTime, timeAgo, stripHtml } from '../utils/helpers';
import BlogMeta from '../components/blog/BlogMeta';
import BlogContent from '../components/blog/BlogContent';
import BlogCard from '../components/common/BlogCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import CommentSection from '../components/blog/CommentSection';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await blogService.getBlog(slug);
        const blogData = res.data?.blog || res.blog || res.data || res;
        setBlog(blogData);
        setLiked(blogData.likes?.includes(user?._id) || false);
        setLikeCount(blogData.likes?.length || 0);
        setBookmarked(blogData.bookmarks?.includes(user?._id) || false);

        if (blogData.category?._id) {
          try {
            const relatedRes = await blogService.getBlogs({
              category: blogData.category._id,
              limit: 3,
            });
            const allRelated = relatedRes.data?.blogs || relatedRes.blogs || [];
            setRelatedBlogs(allRelated.filter((b) => b._id !== blogData._id).slice(0, 3));
          } catch {
            // ignore
          }
        }
      } catch (err) {
        toast.error('Blog not found');
        navigate('/blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug, navigate, user?._id]);

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like blogs');
      return;
    }
    try {
      await blogService.toggleLike(blog._id);
      setLiked(!liked);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch {
      toast.error('Failed to toggle like');
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      toast.error('Please login to bookmark blogs');
      return;
    }
    try {
      await blogService.toggleBookmark(blog._id);
      setBookmarked(!bookmarked);
      toast.success(bookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
    } catch {
      toast.error('Failed to toggle bookmark');
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: blog.title, url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <LoadingSkeleton type="detail" />
      </div>
    );
  }

  if (!blog) return null;

  const readTime = estimateReadTime(blog.content);

  return (
    <>
      <Helmet>
        <title>{blog.title} - BlogNest</title>
        <meta name="description" content={blog.excerpt || stripHtml(blog.content).slice(0, 160)} />
      </Helmet>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {blog.featuredImage && (
            <div className="rounded-2xl overflow-hidden mb-8">
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="w-full h-64 sm:h-80 lg:h-96 object-cover"
              />
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            {blog.title}
          </h1>

          <BlogMeta
            author={blog.author}
            category={blog.category}
            createdAt={blog.createdAt}
            readTime={readTime}
            likeCount={likeCount}
          />

          {blog.excerpt && (
            <p className="text-lg mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {blog.excerpt}
            </p>
          )}

          <div className="rounded-2xl p-6 sm:p-8 mb-8" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <BlogContent content={blog.content} />
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {blog.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/blogs?tag=${encodeURIComponent(tag)}`}
                  className="py-1.5 px-3 text-sm rounded-lg transition-colors hover:opacity-80"
                  style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 py-6 border-t border-b" style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={handleLike}
              className="flex items-center gap-2 py-2 px-4 rounded-xl transition-colors"
              style={{ backgroundColor: 'var(--bg-tertiary)', color: liked ? '#EF4444' : 'var(--text-secondary)' }}
            >
              {liked ? <HiHeart className="w-5 h-5" /> : <HiOutlineHeart className="w-5 h-5" />}
              <span className="text-sm font-medium">{likeCount}</span>
            </button>

            <button
              onClick={handleBookmark}
              className="flex items-center gap-2 py-2 px-4 rounded-xl transition-colors"
              style={{ backgroundColor: 'var(--bg-tertiary)', color: bookmarked ? '#00D4D8' : 'var(--text-secondary)' }}
            >
              {bookmarked ? <HiBookmark className="w-5 h-5" /> : <HiOutlineBookmark className="w-5 h-5" />}
              <span className="text-sm font-medium">Save</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 py-2 px-4 rounded-xl transition-colors"
              style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
            >
              <HiShare className="w-5 h-5" />
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>

          <div className="py-8">
            <CommentSection blogId={blog._id} comments={blog.comments} />
          </div>

          {relatedBlogs.length > 0 && (
            <div className="py-8 border-t" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                Related Blogs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.map((b) => (
                  <BlogCard key={b._id} blog={b} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </article>
    </>
  );
};

export default BlogDetail;
