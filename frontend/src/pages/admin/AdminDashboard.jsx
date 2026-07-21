import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiUsers, HiDocumentText, HiCollection, HiChatAlt2, HiArrowRight } from 'react-icons/hi';
import { Helmet } from 'react-helmet-async';
import adminService from '../../services/adminService';
import { formatDate } from '../../utils/helpers';
import StatsCard from '../../components/admin/StatsCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const statsRes = await adminService.getStats();
        setStats(statsRes.data || statsRes || {});

        const blogsRes = await adminService.getAllBlogs({ limit: 5, sort: '-createdAt' });
        setRecentBlogs(blogsRes.data?.blogs || blogsRes.blogs || []);
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
    { icon: HiUsers, label: 'Total Users', value: stats?.totalUsers || stats?.users || 0, color: '#3B82F6' },
    { icon: HiDocumentText, label: 'Total Blogs', value: stats?.totalBlogs || stats?.blogs || 0, color: '#00D4D8' },
    { icon: HiCollection, label: 'Categories', value: stats?.totalCategories || stats?.categories || 0, color: '#8B5CF6' },
    { icon: HiChatAlt2, label: 'Comments', value: stats?.totalComments || stats?.comments || 0, color: '#F59E0B' },
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
                <StatsCard icon={card.icon} label={card.label} value={card.value} color={card.color} />
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
                          by {blog.author?.name || 'Unknown'} &middot; {formatDate(blog.createdAt)}
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
                  <span className="text-sm font-medium" style={{ color: '#00D4D8' }}>{stats?.publishedBlogs || 0}</span>
                </div>
                <div className="flex justify-between py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Draft Blogs</span>
                  <span className="text-sm font-medium" style={{ color: '#FBBF24' }}>{stats?.draftBlogs || 0}</span>
                </div>
                <div className="flex justify-between py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Views</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{stats?.totalViews || 0}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Likes</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{stats?.totalLikes || 0}</span>
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
