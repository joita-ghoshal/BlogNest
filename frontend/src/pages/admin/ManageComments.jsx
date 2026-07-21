import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import adminService from '../../services/adminService';
import AdminTable from '../../components/admin/AdminTable';
import ConfirmModal from '../../components/common/ConfirmModal';
import Loading from '../../components/common/Loading';
import { formatDate, truncateText } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ManageComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchComments(); }, []);

  const fetchComments = async () => {
    try {
      const res = await adminService.getAllComments();
      setComments(res.comments || res.data || []);
    } catch {} finally { setLoading(false); }
  };

  const handleDelete = async () => {
    try {
      await adminService.adminDeleteComment(deleteId);
      setComments((prev) => prev.filter((c) => c._id !== deleteId));
      toast.success('Comment deleted');
    } catch { toast.error('Failed to delete comment'); }
  };

  const columns = [
    { key: 'content', label: 'Comment', render: (row) => <span className="text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{truncateText(row.content, 80)}</span> },
    { key: 'user', label: 'User', render: (row) => <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{row.user?.name || 'Unknown'}</span> },
    { key: 'blog', label: 'Blog', render: (row) => <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{row.blog?.title || 'Deleted'}</span> },
    { key: 'createdAt', label: 'Date', render: (row) => <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{formatDate(row.createdAt)}</span> },
    { key: 'actions', label: 'Actions', render: (row) => (
      <button onClick={() => setDeleteId(row._id)} className="px-3 py-1 text-xs font-medium text-white rounded-lg" style={{ backgroundColor: '#EF4444' }}>Delete</button>
    )},
  ];

  return (
    <>
      <Helmet><title>Manage Comments - Admin - BlogNest</title></Helmet>
      <div>
        <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>Manage Comments</h1>
        {loading ? <Loading /> : <AdminTable columns={columns} data={comments} />}
      </div>
      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Comment" message="Are you sure you want to delete this comment?" />
    </>
  );
};

export default ManageComments;
