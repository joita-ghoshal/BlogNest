import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import adminService from '../../services/adminService';
import AdminTable from '../../components/admin/AdminTable';
import ConfirmModal from '../../components/common/ConfirmModal';
import Loading from '../../components/common/Loading';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchBlogs(); }, []);

  const fetchBlogs = async () => {
    try {
      const res = await adminService.getAllBlogs();
      setBlogs(res.blogs || res.data || []);
    } catch {} finally { setLoading(false); }
  };

  const handleToggleStatus = async (blog) => {
    try {
      const newPublished = !blog.isPublished;
      await adminService.updateBlog(blog._id, { isPublished: newPublished });
      setBlogs((prev) => prev.map((b) => b._id === blog._id ? { ...b, isPublished: newPublished } : b));
      toast.success(`Blog ${newPublished ? 'published' : 'unpublished'}`);
    } catch { toast.error('Failed to update status'); }
  };

  const handleDelete = async () => {
    try {
      await adminService.adminDeleteBlog(deleteId);
      setBlogs((prev) => prev.filter((b) => b._id !== deleteId));
      toast.success('Blog deleted');
    } catch { toast.error('Failed to delete blog'); }
  };

  const columns = [
    { key: 'title', label: 'Title', render: (row) => (
      <Link to={`/blogs/${row.slug || row._id}`} className="text-sm font-medium hover:text-[#00D4D8] transition-colors line-clamp-1 max-w-[200px] sm:max-w-none" style={{ color: 'var(--text-primary)' }}>{row.title}</Link>
    )},
    { key: 'author', label: 'Author', render: (row) => <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{row.author?.name || 'Unknown'}</span> },
    { key: 'status', label: 'Status', render: (row) => (
      <span className={`px-2 py-1 text-xs rounded-full font-medium whitespace-nowrap ${row.isPublished ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
        {row.isPublished ? 'Published' : 'Draft'}
      </span>
    )},
    { key: 'createdAt', label: 'Date', render: (row) => <span className="text-xs sm:text-sm whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>{formatDate(row.createdAt)}</span> },
    { key: 'actions', label: 'Actions', render: (row) => (
      <div className="flex gap-1.5 sm:gap-2 flex-wrap">
        <button onClick={() => handleToggleStatus(row)} className="px-2 sm:px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap" style={{ backgroundColor: row.isPublished ? '#FEF3C7' : '#D1FAE5', color: row.isPublished ? '#92400E' : '#065F46' }}>
          {row.isPublished ? 'Unpublish' : 'Publish'}
        </button>
        <button onClick={() => setDeleteId(row._id)} className="px-2 sm:px-3 py-1 text-xs font-medium text-white rounded-lg" style={{ backgroundColor: '#EF4444' }}>Delete</button>
      </div>
    )},
  ];

  return (
    <>
      <Helmet><title>Manage Blogs - Admin - BlogNest</title></Helmet>
      <div>
        <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8" style={{ color: 'var(--text-primary)' }}>Manage Blogs</h1>
        {loading ? <Loading /> : <AdminTable columns={columns} data={blogs} />}
      </div>
      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Blog" message="Are you sure you want to delete this blog?" />
    </>
  );
};

export default ManageBlogs;
