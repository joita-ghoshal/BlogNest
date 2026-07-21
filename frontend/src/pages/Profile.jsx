import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import userService from '../services/userService';
import blogService from '../services/blogService';
import useAuth from '../hooks/useAuth';
import { formatDate } from '../utils/helpers';
import BlogCard from '../components/common/BlogCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await userService.getProfile(id);
        const userData = res.data?.user || res.user || res.data || res;
        setProfile(userData);

        const blogsRes = await blogService.getBlogs({ author: id, isPublished: true });
        setBlogs(blogsRes.data?.blogs || blogsRes.blogs || []);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <LoadingSkeleton type="profile" />
      </div>
    );
  }

  if (!profile) return null;

  const isOwnProfile = currentUser?._id === profile._id;

  return (
    <>
      <Helmet>
        <title>{profile.name} - BlogNest</title>
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="rounded-2xl p-6 sm:p-8 mb-8" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden flex-shrink-0" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold" style={{ color: '#00D4D8' }}>
                    {profile.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {profile.name}
                </h1>
                <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>{profile.email}</p>
                {profile.bio && (
                  <p className="text-base mb-3" style={{ color: 'var(--text-secondary)' }}>{profile.bio}</p>
                )}
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Joined {formatDate(profile.createdAt)}
                </p>
              </div>

              {isOwnProfile && (
                <Link
                  to="/edit-profile"
                  className="py-3 px-6 text-base font-medium rounded-xl border transition-colors"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', backgroundColor: 'var(--bg-tertiary)' }}
                >
                  Edit Profile
                </Link>
              )}
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Published Blogs
          </h2>

          {blogs.length === 0 ? (
            <p className="text-base py-8 text-center" style={{ color: 'var(--text-muted)' }}>No blogs published yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <BlogCard blog={blog} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default Profile;
