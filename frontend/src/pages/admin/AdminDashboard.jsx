import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { HiUsers, HiDocumentText, HiCollection, HiChatAlt } from 'react-icons/hi';
import adminService from '../../services/adminService';
import StatsCard from '../../components/admin/StatsCard';
import Loading from '../../components/common/Loading';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await adminService.getStats();
        setStats(res.stats || res.data || res);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <Loading text="Loading dashboard..." />;

  const statCards = [
    { icon: HiUsers, label: 'Total Users', value: stats?.totalUsers || 0, color: '#00D4D8' },
    { icon: HiDocumentText, label: 'Total Blogs', value: stats?.totalBlogs || 0, color: '#00B8BC' },
    { icon: HiCollection, label: 'Categories', value: stats?.totalCategories || 0, color: '#009B9E' },
    { icon: HiChatAlt, label: 'Comments', value: stats?.totalComments || 0, color: '#007F82' },
  ];

  return (
    <>
      <Helmet><title>Admin Dashboard - BlogNest</title></Helmet>
      <div>
        <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {statCards.map((card) => (
            <StatsCard key={card.label} {...card} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="rounded-2xl p-4 sm:p-6" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
            <h3 className="text-base sm:text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Recent Blogs</h3>
            <div className="space-y-4">
              {stats?.recentBlogs?.slice(0, 5).map((blog, i) => (
                <div key={i} className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#00D4D8' }} />
                  <span className="line-clamp-1">{blog.title} <span style={{ color: 'var(--text-muted)' }}>by {blog.author?.name || 'Unknown'}</span></span>
                </div>
              )) || (
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No recent blogs</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-6" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
            <h3 className="text-base sm:text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Published Blogs</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{stats?.publishedBlogs || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Draft Blogs</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{stats?.unpublishedBlogs || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Total Users</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{stats?.totalUsers || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
