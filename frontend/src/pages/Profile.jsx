import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import userService from '../services/userService';
import blogService from '../services/blogService';
import Avatar from '../components/common/Avatar';
import BlogCard from '../components/common/BlogCard';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import { formatDate } from '../utils/helpers';

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const profileRes = await userService.getProfile(id);
        const profileData = profileRes.data || profileRes;
        setUser(profileData.user || profileData);
        setBlogs(profileData.blogs || []);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <Loading text="Loading profile..." />;
  if (!user) return <EmptyState icon="👤" title="User not found" />;

  return (
    <>
      <Helmet><title>{user.name} - BlogNest</title></Helmet>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="rounded-2xl p-8 mb-10" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar user={user} size="xl" />
            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{user.name}</h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
              {user.bio && <p className="text-sm mt-3" style={{ color: 'var(--text-secondary)' }}>{user.bio}</p>}
              <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>Joined {formatDate(user.createdAt)}</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Published Blogs</h2>
        {blogs.length === 0 ? (
          <EmptyState icon="📝" title="No blogs yet" description="This user hasn't published any blogs." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog, i) => <BlogCard key={blog._id} blog={blog} index={i} />)}
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
