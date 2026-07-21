import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiUsers, HiDocumentText, HiCollection, HiChatAlt2, HiArrowRight } from 'react-icons/hi';
import { Helmet } from 'react-helmet-async';
import adminService from '../../services/adminService';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const statsRes = await adminService.getStats();
        setStats(statsRes.data || statsRes || {});

        const blogsRes = await adminService.getAllBlogs({ limit: 5, sort: '-createdAt' });
        setRecentBlogs(blogsRes.data?.blogs || blogsRes.blogs || blogsRes.data || []);
      } catch (err) {
        console.error('Admin dashboard fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 sm:p-8">
        <LoadingSkeleton type="dashboard" />
      </div>
    );
  }

  const statCards = [
    { icon: HiUsers, label: 'Total Users', value: stats?.totalUsers || 0, color: '#3B82F6', to: '/admin/users' },
    { icon: HiDocumentText, label: 'Total Blogs', value: stats?.totalBlogs || 0, color: '#00D4D8', to: '/admin/blogs' },
    { icon: HiCollection, label: 'Categories', value: stats?.totalCategories || 0, color: '#8B5CF6', to: '/admin/categories' },
    { icon: HiChatAlt2, label: 'Comments', value: stats?.totalComments || 0, color: '#F59E0B', to: '/admin/comments' },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - BlogNest</title>
      </Helmet>

      <div className="p-6 sm:p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
            Dashboard
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card, index) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={card.to}
                  className="block rounded-2xl p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
                  style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${card.color}15` }}>
                      <card.icon className="w-6 h-6" style={{ color: card.color }} />
                    </div>
                    <HiArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <p className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                    {card.value.toLocaleString()}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{card.label}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div
              className="lg:col-span-2 rounded-2xl p-6 sm:p-8 space-y-5"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Recent Blogs</h2>
                <Link
                  to="/admin/blogs"
                  className="text-sm font-medium flex items-center gap-1"
                  style={{ color: '#00D4D8' }}
                >
                  View All <HiArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {recentBlogs.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No blogs yet.</p>
              ) : (
                <div className="space-y-4">
                  {recentBlogs.map((blog) => (
                    <div
                      key={blog._id}
                      className="flex items-center justify-between py-3 border-b last:border-b-0"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                          {blog.title}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          by {blog.author?.name || 'Unknown'}
                        </p>
                      </div>
                      <span
                        className="ml-4 py-0.5 px-2 text-xs font-medium rounded-md flex-shrink-0"
                        style={{
                          backgroundColor: blog.isPublished ? 'rgba(0,212,216,0.1)' : 'rgba(251,191,36,0.1)',
                          color: blog.isPublished ? '#00D4D8' : '#FBBF24',
                        }}
                      >
                        {blog.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              className="rounded-2xl p-6 sm:p-8 space-y-5"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Published Blogs</span>
                  <span className="text-sm font-semibold" style={{ color: '#00D4D8' }}>{stats?.publishedBlogs || 0}</span>
                </div>
                <div className="flex justify-between py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Draft Blogs</span>
                  <span className="text-sm font-semibold" style={{ color: '#FBBF24' }}>{stats?.unpublishedBlogs || 0}</span>
                </div>
                <div className="flex justify-between py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Views</span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{(stats?.totalViews || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Likes</span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{(stats?.totalLikes || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminDashboard;
