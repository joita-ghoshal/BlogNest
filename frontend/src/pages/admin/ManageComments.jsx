import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiTrash } from 'react-icons/hi';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import useAuth from '../../hooks/useAuth';
import { formatDate, truncateText } from '../../utils/helpers';
import AdminTable from '../../components/admin/AdminTable';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const DEMO_ADMIN_EMAIL = 'admin@blognest.com';

const ManageComments = () => {
  const { user: currentUser } = useAuth();
  const isDemoAdmin = currentUser?.email === DEMO_ADMIN_EMAIL;
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await adminService.getAllComments();
        setComments(res.data?.comments || res.comments || []);
      } catch {
        toast.error('Failed to fetch comments');
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, []);

  const handleDelete = async (id) => {
    try {
      await adminService.adminDeleteComment(id);
      setComments((prev) => prev.filter((c) => c._id !== id));
      toast.success('Comment deleted');
      setDeleteId(null);
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  if (loading) {
    return (
      <div className="p-6 sm:p-8">
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  const columns = ['Comment', 'User', 'Blog', 'Date', 'Actions'];

  const rows = comments.map((comment) => ({
    _id: comment._id,
    cells: [
      <span className="text-sm truncate block max-w-[300px]" style={{ color: 'var(--text-primary)' }}>
        {truncateText(comment.content || '', 80)}
      </span>,
      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{comment.user?.name || 'Unknown'}</span>,
      <span className="text-sm truncate block max-w-[200px]" style={{ color: 'var(--text-secondary)' }}>
        {comment.blog?.title || 'Unknown'}
      </span>,
      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{formatDate(comment.createdAt)}</span>,
      <button
        onClick={() => setDeleteId(comment._id)}
        disabled={isDemoAdmin}
        className="p-2 rounded-lg disabled:opacity-30"
        style={{ color: isDemoAdmin ? 'var(--text-muted)' : '#EF4444' }}
        title={isDemoAdmin ? 'Read-only (Demo Admin)' : 'Delete'}
      >
        <HiTrash className="w-4 h-4" />
      </button>,
    ],
  }));

  return (
    <>
      <Helmet>
        <title>Manage Comments - Admin - BlogNest</title>
      </Helmet>

      <div className="p-6 sm:p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Manage Comments
            </h1>
            {isDemoAdmin && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(251,191,36,0.1)', color: '#FBBF24' }}>
                Read Only
              </span>
            )}
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
              <h3 className="text-xl font-bold text-center" style={{ color: 'var(--text-primary)' }}>Delete Comment?</h3>
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

export default ManageComments;
