import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPencil, HiTrash } from 'react-icons/hi';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import blogService from '../services/blogService';
import { formatDate, truncateText } from '../utils/helpers';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';

const MyBlogs = () => {
  const [activeTab, setActiveTab] = useState('published');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await blogService.getMyBlogs({ isPublished: activeTab === 'published' });
      setBlogs(res.data?.blogs || res.blogs || []);
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [activeTab]);

  const handleDelete = async (id) => {
    try {
      await blogService.deleteBlog(id);
      toast.success('Blog deleted');
      setBlogs((prev) => prev.filter((b) => b._id !== id));
      setDeleteId(null);
    } catch {
      toast.error('Failed to delete blog');
    }
  };

  return (
    <>
      <Helmet>
        <title>My Blogs - BlogNest</title>
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              My Blogs
            </h1>
            <Link
              to="/create-blog"
              className="py-3 px-6 text-base font-semibold rounded-xl text-center transition-colors"
              style={{ backgroundColor: '#00D4D8', color: '#000' }}
            >
              + New Blog
            </Link>
          </div>

          <div className="flex gap-1 p-1 rounded-xl mb-8" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            {['published', 'draft'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all"
                style={{
                  backgroundColor: activeTab === tab ? 'var(--bg-secondary)' : 'transparent',
                  color: activeTab === tab ? '#00D4D8' : 'var(--text-secondary)',
                  boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <LoadingSkeleton type="list" count={4} />
          ) : blogs.length === 0 ? (
            <EmptyState
              title={`No ${activeTab === 'published' ? 'published' : 'draft'} blogs`}
              description="Start writing to see your blogs here."
            />
          ) : (
            <div className="space-y-4">
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6"
                  style={{ backgroundColor: 'var(--bg-secondary)' }}
                >
                  {blog.featuredImage && (
                    <div className="sm:w-40 h-32 sm:h-28 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={blog.featuredImage} alt={blog.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="py-0.5 px-2 text-xs font-medium rounded-md"
                        style={{
                          backgroundColor: blog.isPublished ? 'rgba(0,212,216,0.1)' : 'rgba(251,191,36,0.1)',
                          color: blog.isPublished ? '#00D4D8' : '#FBBF24',
                        }}
                      >
                        {blog.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold mb-1 truncate" style={{ color: 'var(--text-primary)' }}>
                      {blog.title}
                    </h2>
                    <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                      {truncateText(blog.excerpt || '', 120)}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {formatDate(blog.createdAt)}
                    </p>
                  </div>

                  <div className="flex sm:flex-col gap-2 sm:justify-center flex-shrink-0">
                    <Link
                      to={`/edit-blog/${blog._id}`}
                      className="py-2 px-4 text-sm font-medium rounded-xl border flex items-center justify-center gap-1 transition-colors"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                    >
                      <HiPencil className="w-4 h-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteId(blog._id)}
                      className="py-2 px-4 text-sm font-medium rounded-xl border flex items-center justify-center gap-1 transition-colors"
                      style={{ borderColor: 'var(--border)', color: '#EF4444' }}
                    >
                      <HiTrash className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <AnimatePresence>
          {deleteId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
              onClick={() => setDeleteId(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="rounded-2xl p-6 sm:p-8 max-w-md w-full space-y-5"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Delete Blog?</h3>
                <p style={{ color: 'var(--text-secondary)' }}>This action cannot be undone. The blog will be permanently removed.</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setDeleteId(null)}
                    className="flex-1 py-3 px-6 text-base font-medium rounded-xl border transition-colors"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteId)}
                    className="flex-1 py-3 px-6 text-base font-semibold rounded-xl transition-colors"
                    style={{ backgroundColor: '#EF4444', color: '#FFF' }}
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default MyBlogs;
