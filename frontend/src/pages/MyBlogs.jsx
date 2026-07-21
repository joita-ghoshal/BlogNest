import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { HiPencil, HiTrash } from 'react-icons/hi';
import blogService from '../services/blogService';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import ConfirmModal from '../components/common/ConfirmModal';
import { formatDate, stripHtml, truncateText } from '../utils/helpers';
import toast from 'react-hot-toast';

const MyBlogs = () => {
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('published');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await blogService.getMyBlogs({ page: 1, limit: 50 });
      setAllBlogs(res.data || []);
    } catch {
      setAllBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = allBlogs.filter((b) =>
    tab === 'published' ? b.isPublished : !b.isPublished
  );

  const handleDelete = async () => {
    try {
      await blogService.deleteBlog(deleteId);
      setAllBlogs((prev) => prev.filter((b) => b._id !== deleteId));
      toast.success('Blog deleted');
    } catch {
      toast.error('Failed to delete blog');
    }
  };

  return (
    <>
      <Helmet><title>My Blogs - BlogNest</title></Helmet>
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10">
        <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>My Blogs</h1>

        <div className="flex gap-2 mb-6 sm:mb-8">
          {['published', 'draft'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-5 py-2 text-sm font-medium rounded-xl transition-colors capitalize"
              style={{
                backgroundColor: tab === t ? '#00D4D8' : 'var(--bg-secondary)',
                color: tab === t ? '#fff' : 'var(--text-muted)',
                border: '1px solid var(--border)',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <Loading />
        ) : filteredBlogs.length === 0 ? (
          <EmptyState icon="📝" title="No blogs yet" description="Start writing your first blog!" actionLabel="Create Blog" actionTo="/create-blog" />
        ) : (
          <div className="space-y-4">
            {filteredBlogs.map((blog, i) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl"
                style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
              >
                {blog.featuredImage?.url && (
                  <img src={blog.featuredImage.url} alt="" className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-lg flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <Link to={`/blogs/${blog.slug || blog._id}`} className="text-sm sm:text-base font-semibold hover:text-[#00D4D8] transition-colors line-clamp-1" style={{ color: 'var(--text-primary)' }}>
                    {blog.title}
                  </Link>
                  <p className="text-xs sm:text-sm mt-1 line-clamp-1" style={{ color: 'var(--text-muted)' }}>
                    {truncateText(stripHtml(blog.content), 80)}
                  </p>
                  <p className="text-xs mt-1.5 sm:mt-2" style={{ color: 'var(--text-muted)' }}>{formatDate(blog.createdAt)}</p>
                </div>
                <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                  <Link to={`/edit-blog/${blog._id}`} className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors" style={{ color: 'var(--text-muted)' }}>
                    <HiPencil size={16} />
                  </Link>
                  <button onClick={() => setDeleteId(blog._id)} className="p-2 rounded-lg hover:bg-red-50 transition-colors" style={{ color: '#EF4444' }}>
                    <HiTrash size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Blog" message="Are you sure you want to delete this blog? This action cannot be undone." />
    </>
  );
};

export default MyBlogs;
