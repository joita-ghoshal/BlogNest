import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiCheck, HiX, HiTrash } from 'react-icons/hi';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import useAuth from '../../hooks/useAuth';
import { formatDate } from '../../utils/helpers';
import AdminTable from '../../components/admin/AdminTable';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const DEMO_ADMIN_EMAIL = 'admin@blognest.com';

const ManageBlogs = () => {
  const { user: currentUser } = useAuth();
  const isDemoAdmin = currentUser?.email === DEMO_ADMIN_EMAIL;
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await adminService.getAllBlogs();
        setBlogs(res.data?.blogs || res.blogs || []);
      } catch {
        toast.error('Failed to fetch blogs');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handlePublishToggle = async (id, isPublished) => {
    try {
      await adminService.updateBlog(id, { isPublished: !isPublished });
      setBlogs((prev) =>
        prev.map((b) => (b._id === id ? { ...b, isPublished: !isPublished } : b))
      );
      toast.success(isPublished ? 'Blog unpublished' : 'Blog published');
    } catch {
      toast.error('Failed to update blog');
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.adminDeleteBlog(id);
      setBlogs((prev) => prev.filter((b) => b._id !== id));
      toast.success('Blog deleted');
      setDeleteId(null);
    } catch {
      toast.error('Failed to delete blog');
    }
  };

  if (loading) {
    return (
      <div className="p-6 sm:p-8">
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  const columns = ['Title', 'Author', 'Status', 'Date', 'Actions'];

  const rows = blogs.map((blog) => ({
    _id: blog._id,
    cells: [
      <span className="text-sm font-medium truncate block max-w-[250px]" style={{ color: 'var(--text-primary)' }}>{blog.title}</span>,
      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{blog.author?.name || 'Unknown'}</span>,
      <span
        className="py-0.5 px-2 text-xs font-medium rounded-md"
        style={{
          backgroundColor: blog.isPublished ? 'rgba(0,212,216,0.1)' : 'rgba(251,191,36,0.1)',
          color: blog.isPublished ? '#00D4D8' : '#FBBF24',
        }}
      >
        {blog.isPublished ? 'Published' : 'Draft'}
      </span>,
      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{formatDate(blog.createdAt)}</span>,
      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePublishToggle(blog._id, blog.isPublished)}
          disabled={isDemoAdmin}
          className="p-2 rounded-lg transition-colors disabled:opacity-30"
          style={{ color: blog.isPublished ? '#FBBF24' : '#00D4D8' }}
          title={isDemoAdmin ? 'Read-only (Demo Admin)' : blog.isPublished ? 'Unpublish' : 'Publish'}
        >
          {blog.isPublished ? <HiX className="w-4 h-4" /> : <HiCheck className="w-4 h-4" />}
        </button>
        <button
          onClick={() => setDeleteId(blog._id)}
          disabled={isDemoAdmin}
          className="p-2 rounded-lg transition-colors disabled:opacity-30"
          style={{ color: isDemoAdmin ? 'var(--text-muted)' : '#EF4444' }}
          title={isDemoAdmin ? 'Read-only (Demo Admin)' : 'Delete'}
        >
          <HiTrash className="w-4 h-4" />
        </button>
      </div>,
    ],
  }));

  return (
    <>
      <Helmet>
        <title>Manage Blogs - Admin - BlogNest</title>
      </Helmet>

      <div className="p-6 sm:p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Manage Blogs
              </h1>
              {isDemoAdmin && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(251,191,36,0.1)', color: '#FBBF24' }}>
                  Read Only
                </span>
              )}
            </div>
          </div>

          <div className="rounded-2xl p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <AdminTable columns={columns} rows={rows} />
          </div>
        </motion.div>

        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="rounded-2xl p-6 sm:p-8 max-w-md w-full space-y-5"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-center" style={{ color: 'var(--text-primary)' }}>Delete Blog?</h3>
              <p className="text-center" style={{ color: 'var(--text-secondary)' }}>This action cannot be undone.</p>
              <div className="flex gap-4">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-3 px-6 text-base font-medium rounded-xl border" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>Cancel</button>
                <button onClick={() => handleDelete(deleteId)} className="flex-1 py-3 px-6 text-base font-semibold rounded-xl" style={{ backgroundColor: '#EF4444', color: '#FFF' }}>Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default ManageBlogs;
